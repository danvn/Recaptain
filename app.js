'use strict'

// variable setup
var slack = require('slack');
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

/*slack.im.open({token, user: "U1EH544TV"}, (err, data) => {
  console.log(data);

  slack.chat.postMessage({token, channel: data.channel.id, text: "blah"}, (a, data) => console.log(data));

})*/

bot.message((message) => {
  let { channel, text, user, username } = message;
  parse(text)
    .then((result) => {
      // if first word is recap, respond and get channel history
      if(GetFirstWord(text) == "<@U1GF1N0CQ>:"){
        console.log("message recieve");
        slack.im.open({token, user}, (err, data) => {
          channel = data.channel.id;
          username = "recaptain";
          slack.chat.postMessage({token, channel, username, icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png", text: "It's Lit"}, (a, data) => 
                                 console.log("@"+ getHandle(user) + ": " + text));
        })
        /*slack.im.history({token, channel}, (err, data) => {
         if (err) {
         console.log(err);
         }

         console.log(data);
         });*/
      };
    })
    .catch((err) => {
      // handle parse error
    });
});

