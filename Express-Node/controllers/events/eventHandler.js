require("dotenv").config();
let Country = require('country-state-city').Country;
let State = require('country-state-city').State;
let City = require('country-state-city').City;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/webAuth");
const { BASE_URL } = process.env;

const User = require("../../model/user");
const Cook = require("../../model/cook");
const Recipe = require("../../model/recipe");
const Recipetype = require("../../model/recipetype");

let clients = [];
let facts = {'connectEventHandler': true};


exports.init = (request, response, next) => {

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
    response.writeHead(200, headers);

    //const data = JSON.stringify(facts);

    response.write(`data: ${JSON.stringify(facts)}\n\n`);
    const clientId = request.params.id;

    const newClient = {
      id: clientId,
      response
    };

    clients.push(newClient);

    request.on('close', () => {
      //console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
}

// function sendEventsToAll(newFact) {
//   clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
// }

exports.sendEventsToSpecificUser = (user_id, type) => {
  clients.forEach(client => {
    if(client.id == user_id){
      //client.response.write(`data: ${JSON.stringify(newFact)}\n\n`)
      client.response.write(`data: ${JSON.stringify({event:type, user_id: user_id})}\n\n`)
    }
  })
  return true;
}