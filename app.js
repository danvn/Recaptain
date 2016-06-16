'use strict'

// variable setup
var _ = require('lodash');
var commands = require('./commands');
var parse = require('./parse');
//var token = "xoxb-50511748432-Rztd1yjENcRHpJ9llAfMQbpo";
var slack = require('slack');
var bot = slack.rtm.client();
var token = process.env.token;
bot.listen({token:token});


// introduction function.
/*bot.started(function() {
   slack.im.open({token, user: "U1EH544TV"}, (err, data) => {
        slack.chat.postMessage({token, channel: data.channel.id, username: "recaptain", text: "Welcome to recaptain!", icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png"}, (a, data) => {
        console.log("@@@");
})
      
})
});*/


bot.message((message) => {
  let { channel, text, user, username, ts } = message;
  const command_reg = [
    [/^recap|:\srecap|:recap/i, commands.recap],
    [/^help|:\shelp|:help/i, commands.help]
  ];

  let fn = () => null;
  for(let r of command_reg) {
    if (r[0].exec(text) != null) {
      text = text.replace(r[0], '')

      fn = r[1];
    }
  }

  parse(text)
    .then((result) => {
      console.log("\npromise initiatied");
      // see if message is bot mention
      fn(message, result);
    })
  .catch((err) => {
      // handle parse error
        console.log(err);
    });
});

