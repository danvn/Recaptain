'use strict'

// variable setup
var _ = require('lodash');
var commands = require('./commands');
var parse = require('./parse');
var db = require('./db');
var slack = require('slack');
var bot = slack.rtm.client();
var token = process.env.token;
bot.listen({token:token});

bot.message((message) => {
  let { channel, text, user, username, ts } = message;

  if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
    //Get string without bot mention
    text = text.replace('<@U1GF1N0CQ>: ','');
  }

  const command_reg = [
    [/^help|:\shelp|:help/i, commands.help],
    [/^recap$/i, commands.onlyrecap]
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

function getChannelMembers(token,channel){
    return new Promise((resolve, reject) => {
        slack.channels.info({token: token, channel: channel}, (err, data) => {
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

function openIMChannel(token, user){
    slack.im.open({token: token, user: user}, (err, data) => {
        // get each member of channels' direct message channel ID 
        console.log(data);
        console.log("Direct Message data: " + data.channel.id);
        if (err) reject(err);
        else resolve(data);
  });
};

function GetFirstWord(str) {
  if (str.indexOf(' ' ) == -1)
    return str;
  else
    return str.substr(0, str.indexOf(' ' ));
};

// If recaptain is invited to a new channel
/*
    if (message.text == "<@U1GF1N0CQ|recaptain> has joined the channel"){
        //console.log("getChannelMembers(token, message.channel: ")
        var channelMembers;

        // Get user ID's of all members in channel bot was added to
        slack.channels.info({token, channel}, (err, data) => {
            channelMembers = data.channel.members;
            console.log("channelMembers: " + channelMembers);
            console.log("channelMembers length: " + channelMembers.length);
            for(var i = 0; i < channelMembers.length -1 ; i++){   
                // Get each member of channels' direct message channel ID 
                slack.im.open({token, user: channelMembers[i]}, (err, data) => {
                    console.log(data);
                    console.log("Direct Message data: " + data.channel.id);
                    var dmID = data.channel.id;

                    // Send direct message to that user in channel
                    slack.chat.postMessage({token, 
                        channel: dmID, 
                        text: "Hi! I'm Recaptain.\nI'm a robot that can summarize your channel's history.\nIf you'd like to learn more about how I can help you stay updated in your Slack channels, type in this command:\n>@recaptain: help",
                        // attachments: [{
                        //     "text": "@recaptain help", 
                        //     "color": "5CABFF"}],
                        username: "Recaptain",
                        icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png",
                    }, 
                        (err, data)=>{
                            if(err) console.log(err);
                        })

                });
            };

        });


        //console.log("channelMembers[0]: " + channelMembers[0]);
        // Get direct message channel ID of each userid in channel


        // console.log("Bot added to a new channel.\n");
        // console.log(channelMembers);
        // for (var i = 0; i < channelMembers.length; i++){
        //     openIMChannel(token, channelMembers[i]);
        // }
        // return new Promise((resolve, reject) => {
        //   console.log("Promise entered.\n");
        //   for (var i=0; i < channelMembers.length; i++){
        //     console.log("\nLoop entered."+ i + " " + channelMembers[i]);

        //     }
        // });
    };
*/


