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

  if (message.text == "<@U1GF1N0CQ|recaptain> has joined the channel"){
      var channelMembers;
    //console.log("@recaptain has joined a channel.");
      slack.channels.info({token, channel}, (err, data) => {
        console.log("data.channel.members: " + data.channel.members);
        channelMembers = data.channel.members;
        var firstMember = channelMembers[0];
        console.log("channelMembers: " + channelMembers);
        // console.log(channelMembers[0]);
        // for (var i=0; i < data.channel.members.length; i++){
        //   // console.log(data.channel.members[i]);

        return new Promise((resolve, reject) => {
          slack.im.open({token, user: firstMember}, (err, data) => {
            console.log("firstMember: " + firstMember);
            console.log("\nfirstMembers IM data: " + data.channel.id);
            if (err) reject(err);
            else resolve(data);
            // console.log("User's Direct Message Channel ID: " + dmChannel);
          });
        });

      });


  };

  fn(message);
});

function GetFirstWord(str) {
  if (str.indexOf(' ' ) == -1)
    return str;
  else
    return str.substr(0, str.indexOf(' ' ));
};


