var token = process.env.token;
var parse = require('./parse');
var modules = require('./modules');
var _ = require('lodash');
var slack = require('./slack');
var parse = require('./parse');
var watson = require('./watson');
var moment = require('moment');

var icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png";

exports.storeHistory = (message) => {
    let {channel, text, user, username, ts } = message;
    parse(text)
    .then((ast) => slack.history(channel, ast.date))
	  .then((result) => {
      let { messages, ast } = result;
      console.log(messages);
      return (messages);
    });
};
// Handles the `recap` command
exports.recap = (message) => {
  let { channel, text, user, username, ts } = message;
  console.log("TXT: " + text);

  parse(text)
    .then((ast) => {
      return ast.channels
    })
    .then((result) => {
      // Strip special characters
      for (var i = 0; i < result.length; i++){
        result[i] = result[i].replace(/[^a-zA-Z0-9 ]/g, "");
      }
      return result
    })
    .then((result) => {     
        console.log(result);
        return result;
    })
    
      // Get history for each channel id in array result
      /*for (var i = 0; i < result.length; i++){
        console.log("INSIDE");
        slack.history(result[i], message.ts)
        .then((result) => {
            console.log("Second");
            return result;
        })
      }
      return ("hello")
      })*/

      
	  .catch((err) => {
      slack.im(user)
        .then((result) => {
        let message = {
        username: "recaptain",
        channel: result.channel.id,
        text: "",
            attach: [{
            title: "Whoops!",
            color: "#FF0000",
            text: "One of the channels you entered is not valid!"
            }]
         }
        return slack.post(message.channel, message.text, icon, message.username, message.attach);
     })
	 });
};

exports.onlyrecap = (message) => {
  console.log("Only recap intitated");
  let { channel, text, user, username, ts } = message;

  slack.im(user)
    .then((result) => {
      if(result.channel.id == channel){
        return slack.history("C1MCA2P9V", moment().subtract(7, 'days'));
      }
      else {
        return Promise.reject("not a channel");
      }
    })
    .then((result) => {
      let messages = _.map(result, (e) => {
        return e.text;
      });

      let text = _.join(messages, '\n');

      console.log(text)
      return watson.get_keywords(text);
    })
    .then((result) => {
      username = "recaptain";

      let message = {
        username: "recaptain",
        channel: channel,
        text: JSON.stringify(result)
      };

      return slack.post(token, message.channel, message.text, icon, message.username, message.attach);
    })
    .catch((err) => console.err("Error:", err));
};

exports.help = (message, ast) => {
    console.log("they initiated help"); 
    let { channel, text, user, username, ts } = message;
    getHandle(user)
        .then((result) => {
            return name = result;
        })
        .then((result) => {
            return slack.im(user)
        })
        .then((result) => {
           if(result.channel.id == channel) {
           channel = result.channel.id;
           username = "recaptain";
           text = ("Hey" + name  + ", Heard you needed help!");

           attach =  [{"title": "How to use me", "text": "All you have to do is type in recap", "color": "#36a64f"}]
           slack.post(channel, text, icon, username, attach)

        }
       })
       .catch((err) => {
         console.log(err);
       });
};

function getHandle(user) {
  return new Promise((resolve, reject) => {
    slack.userdata(user) 
      .then((result) => {
        name = JSON.stringify(result.user.name);
        console.log(name);
        resolve(name);
        //return name;
      });
  });
};

