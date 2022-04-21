require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const MAIL = require("../../config/mail");
const { MAIL_FROM } = process.env;


// add recipe
exports.contactUs = async function(req, res) {
  // Our register logic starts here
  try {
    const { fullname, email, subject, message } = req.body;
    if (!(fullname && email && subject && message)) {
      return res.status(400).send({"status": false,'message': "All inputs are required"});
    }
    let mailDetails = {
        from: MAIL_FROM,
        to: MAIL_FROM,
        subject: subject,
        html: 'Name: '+fullname+'<br>Message: '+message
    };
    MAIL.mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
          res.status(500).json({"status": false, 'message': "Something wnt wrong"});
        } else {
            res.status(200).json({"status": true,'message': "Email send Successfully"});
        }
    });

    return res.status(201).json({"status": true, 'message': "Send Successfully"});

  } catch (err) {
    console.log(err);
  }
};
