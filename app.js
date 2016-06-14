'use strict'

// variable setup
var Botkit = require('botkit');
var slack = require('slack');
var parse = require('./parse');

var controller = Botkit.slackbot({
  debug: false,
});

var token = "xoxb-50511748432-Rztd1yjENcRHpJ9llAfMQbpd";

var bot = controller.spawn({
  token
}).startRTM();

controller.on('direct_mention', (bot, message) => {
  let { channel, text } = message;

  parse(text);

  slack.channels.history({token, channel}, (err, data) => {
    if (err) {
      console.log(err);
    }

    console.log(data);
  });
});
