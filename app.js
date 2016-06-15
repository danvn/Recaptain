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

function checkMentions(str) {
    str = str.match(/<(.*)>/);
    if (str != null)
        console.log("You wanted mentions");
    else
        console.log("failed to grab mentions");
};

function getHandle(user) {
  slack.users.info({token, user}, (err,data) => {
    return data.name;
  })
};

function checkMentions(str) {
    str = str.match(/<(.*)>/);
    if (str != null)
        console.log("You wanted mentions");
    else
        console.log("failed to grab mentions");
};

function checkLink(str) {
    str = str.match(/(links)/);
    if (str != null)
        console.log("You wanted links");
    else
        console.log("failed to grab links");
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
  let { channel, text, user, username } = message;
  parse(text)
    .then((result) => {
      console.log("\npromise initiatied");
      // see if message is bot mention
      if(GetFirstWord(text) == "<@U1GF1N0CQ>:"){
        console.log(">> New @recaptain mention instance:");
        console.log("    --> userid: " + user);

        // Convert userid --> handle
        slack.users.info({token, user}, (err,data) => {
        console.log("       |\n       --> @" + data.user.name + ": " + text + "\n");
        var handle = data.user.name; 
        });

        //Get string without bot mention
        var myString = text; // Message body
        myString = myString.replace('<@U1GF1N0CQ>: ','');   
        console.log("Message: " + myString);

        // Check if they had a mention
        checkMentions(myString);

        // Check if they wanted links
        checkLink(myString);

        console.log(myString);

        //Open IM if there isn't already one
        slack.im.open({token, user}, (err, data) => {
          channel = data.channel.id;
          username = "recaptain";

          // Reply posts go here based on what they ask for. 
          slack.chat.postMessage({token, channel, username, icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png", 
            text: JSON.stringify(result)}, (a, data) => 
                   console.log("@"+ getHandle(user) + ": " + text));
        })
      };
    })
    .catch((err) => {
      // handle parse error
        console.log(err);
    });
});

