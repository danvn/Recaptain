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

  if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
    //Get string without bot mention
    text = text.replace('<@U1GF1N0CQ>: ','');
  }

  const command_reg = [
    [/^recap|:\srecap|:recap/i, commands.recap],
    [/^help|:\shelp|:help/i, commands.help]
  ];

  let fn = () => null;
  for(let r of command_reg) {
    if (r[0].exec(text) != null) {
      text = text.replace(r[0], '');

      fn = r[1];
    }
  }

  message.text = text;
  console.log("message text", message);

  fn(message);
});

function GetFirstWord(str) {
  if (str.indexOf(' ' ) == -1)
    return str;
  else
    return str.substr(0, str.indexOf(' ' ));
};

function getHandle(token, user) {
  return new Promise((resolve, reject) => {
    console.log("INSIDE GETHANDLE " + user);
    slack.userdata(token, user) 
      .then((result) => {
        name = JSON.stringify(result.user.name);
        console.log(name);
        resolve(name);
        //return name;
      });
  });
};
