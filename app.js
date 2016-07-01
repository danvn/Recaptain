'use strict'

// variable setup
var _ = require('lodash');
var commands = require('./lib/commands');
var parse = require('./lib/parse');
var db = require('./lib/db');
var slack = require('slack');
var bot = slack.rtm.client();
var token = process.env.token;
bot.listen({token:token});




bot.message((message) => {
 let { channel, text, user, team, ts } = message;


  const command_reg = [
    [/^recap/i, commands.recap],
    [/^help|:\shelp|:help/i, commands.help],
    [/^<@U1GF1N0CQ/i, commands.storeHistory] 
  ];

  let fn = () => null;
  for(let r of command_reg) {
    if (r[0].exec(text) != null) {
      text = text.replace(r[0], '');
      fn = r[1];
    }
  }

  message.text = text;
  fn(message);

});

function getChannelMembers(channel){
    return new Promise((resolve, reject) => {
        slack.channels.info({token, channel: channel}, (err, data) => {
            if (err) reject(err);
            else resolve(data);
            var channelMembers;
            channelMembers = data.channel.members;
            console.log(data);
            console.log("channelMembers: " + channelMembers);
            return channelMembers;
        });
    });
}

function openIMChannel(user){
    slack.im.open({user: user}, (err, data) => {
        // get each member of channels' direct message channel ID 
        console.log(data);
        console.log("Direct Message data: " + data.channel.id);
        if (err) reject(err);
        else resolve(data);
  });
};
