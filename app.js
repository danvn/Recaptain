// variable setup
var Botkit = require('botkit');
var slack = require('slack');

var controller = Botkit.slackbot({
  debug: false,
});

var bot = controller.spawn({
	token: process.env.TOKEN
}).startRTM();

controller.on('direct_mention', (bot, message) => {
  console.log(message);
})
