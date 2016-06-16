'use strict'

// variable setup
var slack = require('slack');
var _ = require('lodash');
var commands = require('./commands');
var parse = require('./parse');
//var token = "xoxb-50511748432-Rztd1yjENcRHpJ9llAfMQbpo";
var bot = slack.rtm.client();
var token = process.env.token;
bot.listen({token:token});

//function to check if 1st word is recap
function GetFirstWord(str) {
    if (str.indexOf(' ') == -1)
        return str;
    else
        return str.substr(0, str.indexOf(' '));
};

function getHandle(user) {
  slack.users.info({token, user}, (err,data) => {
    return data.name;
  })
};


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
    [/^recap/i, commands.recap],
    [/^help/i, commands.help]
  ];

  const fn = () => null;
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

