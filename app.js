'use strict'

// variable setup
var slack = require('slack');
var parse = require('./parse');
//var token = "xoxb-50511748432-Rztd1yjENcRHpJ9llAfMQbpd";
var bot = slack.rtm.client();
var token = process.env.token;
bot.listen({token:token});


bot.message((message) => {
  let { channel, text, user } = message;
  parse(text);
  if (user != bot){
    console.log(text);
  }
  slack.channels.history({token, channel}, (err, data) => {
    if (err) {
      console.log(err);
    }
   
  });
});
