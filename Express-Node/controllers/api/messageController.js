require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const MAIL = require("../../config/mail");
const { MAIL_FROM } = process.env;
const Message = require("../../model/message");
const User = require("../../model/user");
const Cook = require("../../model/cook");


// send message
exports.send = async function(req, res) {

  try {
    const { message, send_to } = req.body;
    if (!(send_to && message)) {
      return res.status(400).send({"status": false,'message': "All inputs are required"});
    }
    var cook_id = null;
    var user_id = null;
    if(req.user.login_as == 'cook'){
      cook_id = req.user.user_id;
      user_id = send_to;
      const user = await User.findOne({_id : send_to}).lean().exec();
      if(!user){
        return res.status(201).json({"status": false, 'message': "not a valid user id"});
      }
    }
    if(req.user.login_as == 'user'){
      user_id = req.user.user_id;
      cook_id = send_to;
      const cook = await Cook.findOne({_id : send_to}).lean().exec();
      if(!cook){
        return res.status(201).json({"status": false, 'message': "not a valid cook id"});
      }
    }
    
    const messageData = await Message.create({
      message,
      cook_id: cook_id,
      user_id: user_id,
      from: req.user.login_as,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({"status": true, 'message': "Send Successfully"});

  } catch (err) {
    console.log(err);
  }
};

// send message
exports.markasread = async function(req, res) {

  try {
    const { chat_with } = req.body;
    if (!(chat_with)) {
      return res.status(400).send({"status": false,'message': "All inputs are required"});
    }
    var cook_id = null;
    var user_id = null;
    if(req.user.login_as == 'cook'){
      cook_id = req.user.user_id;
      user_id = chat_with;
      const messageData = await Message.find({cook_id: cook_id, user_id: user_id, from: 'user'}).updateMany({
        is_read: true,
      });
    }
    if(req.user.login_as == 'user'){
      user_id = req.user.user_id;
      cook_id = chat_with;
      const messageData = await Message.find({cook_id: cook_id, user_id: user_id, from: 'cook'}).updateMany({
        is_read: true,
      });
    }

    return res.status(201).json({"status": true, 'message': "Updated Successfully"});

  } catch (err) {
    console.log(err);
  }
};

// send message
exports.unreadmessagecount = async function(req, res) {

  try {
    var cook_id = null;
    var user_id = null;
    if(req.user.login_as == 'cook'){
      cook_id = req.user.user_id;
      var messageData = await Message.countDocuments({cook_id: cook_id, from: 'user', is_read:false})
    }
    if(req.user.login_as == 'user'){
      user_id = req.user.user_id;
      var messageData = await Message.countDocuments({user_id: user_id, from: 'cook', is_read:false})
    }

    return res.status(201).json({"status": true, 'count': messageData});

  } catch (err) {
    console.log(err);
  }
};

// get all chat users
exports.allchatusers = async function(req, res) {
  try {
    if(req.user.login_as == 'cook'){
      const allUsers = await Message.find({cook_id: req.user.user_id}).sort({created_at: 'DESC' }).select('user_id');
      var allIds =[];
      allUsers.forEach(data => { 
        if(!allIds.includes(data.user_id.toString())){
          allIds.push(data.user_id.toString());
        }
      });
      const allUsersData = await User.find({_id:  {$in: allIds}})
                          .populate({path: 'unreadCount',match: { is_read: false, from: 'user' } })
                          .populate({path: 'lastMessage', match: { cook_id: req.user.user_id },options: { sort: { 'created_at': -1 }, perDocumentLimit: 1} })
                          .lean()
                          .exec();
      var sortDataForReturn = [];
      allIds.forEach(data => { 
        allUsersData.forEach(dataelemeny => { 
          if((dataelemeny._id.toString() == data)){
            sortDataForReturn.push(dataelemeny);
          }
        });
      });
      return res.status(201).json({"status": true, 'data': sortDataForReturn});
    } else {
      var allUsers = await Message.find({user_id: req.user.user_id}).sort({created_at: 'DESC' }).select('cook_id');
      var allIds =[];
      allUsers.forEach(data => { 
        if(!allIds.includes(data.cook_id.toString())){
          allIds.push(data.cook_id.toString());
        }
      });
      const allUsersData = await Cook.find({_id:  {$in: allIds}})
                          .populate({path: 'unreadCount',match: { is_read: false, from: 'cook' } })
                          .populate({path: 'lastMessage', match: { user_id: req.user.user_id }, options: { sort: { 'created_at': -1 }, perDocumentLimit: 1} })
                          .lean()
                          .exec();

      var sortDataForReturn = [];
      allIds.forEach(data => { 
        allUsersData.forEach(dataelemeny => { 
          if((dataelemeny._id.toString() == data)){
            sortDataForReturn.push(dataelemeny);
          }
        });
      });
      return res.status(201).json({"status": true, 'data': sortDataForReturn});
    }

  } catch (err) {
    console.log(err);
  }
};

// get all message
exports.allmessage = async function(req, res) {

  try {
    const limit =  Number(req.query.limit ? req.query.limit : 10);
    const page =  Number(req.query.page ? (req.query.page-1) : 0);
    const chatwith = req.params.id;
    if (!(chatwith)) {
      return res.status(400).send({"status": false,'message': "All inputs are required"});
    }
    if(req.user.login_as == 'cook'){
      const allMessages = await Message.find({cook_id: req.user.user_id, user_id: chatwith}).sort({'created_at': -1}).skip(page*limit).limit(Number(limit)).lean()
                          .exec();
      return res.status(201).json({"status": true, 'data': allMessages.reverse()});
    } else {
      const allMessages = await Message.find({user_id: req.user.user_id, cook_id: chatwith}).sort({'created_at': -1}).skip(page*limit).limit(Number(limit)).lean()
                          .exec();
      return res.status(201).json({"status": true, 'data': allMessages.reverse()});
    }

  } catch (err) {
    console.log(err);
  }
};