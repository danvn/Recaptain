// variable setup
var Botkit = require('botkit');

var controller = Botkit.slackbot({							debut: true,
});

var os = require('os');

var bot = controller.spawn({
	token: process.env.token
}).startRTM();

// Bot listens for key words.
controller.hears(['recap','recaptain'],'direct_message,direct_mention,mention', function(bot, message){
	controller.storage.users.get(message.user, function(err, user){	
		bot.reply(message, "I can recap shit nigga");
	});	
});




