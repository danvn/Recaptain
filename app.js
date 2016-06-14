'use strict'

// variable setup
var slack = require('slack');
var parse = require('./parse');
//var token = "xoxb-50511748432-Rztd1yjENcRHpJ9llAfMQbpo";
var bot = slack.rtm.client();
var token = process.env.token;
bot.listen({token:token});

//function to check if 1st word is recap
function GetFirstWord(str){
    if (str.indexOf(' ') == -1)
        return str;
    else
        return str.substr(0, str.indexOf(' '));
};

bot.message((message) => {
  let { channel, text, user, username } = message;
  parse(text);
  // if first word is recap, respond and get channel history
  if(GetFirstWord(text) == "<@U1GF1N0CQ>:"){
    console.log(message);
    // Open DM if there isn't already one. 
    slack.im.open({token, user}, (err, data) => {
        slack.chat.postMessage({token, channel: data.channel.id, text: "It's Lit"}, (a, data)        => console.log("this point")); // posts message content.
})
    slack.im.history({token, channel}, (err, data) => {
    if (err) {
      console.log(err);
    }

    console.log(data);
    });
  };
});

