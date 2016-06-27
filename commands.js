var token = process.env.token;
var parse = require('./parse');
var modules = require('./modules');
var _ = require('lodash');
var slack = require('./slack');
var parse = require('./parse');

var icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png";


exports.storeHistory = (message) => {
    let {channel, text, user, username, ts } = message;
    parse(text)
     .then((ast) => slack.history(channel, ast.date)
          .then((result) => {
            return { messages: _.filter(result, (e) => e.text != null), ast };
          }))
	  .then((result) => {
      let { messages, ast } = result;
      console.log(messages);
      return (messages);
    })
};
// Handles the `recap` command
exports.recap = (message) => {
  let { channel, text, user, username, ts } = message;
  console.log("TXT: " + text);

  parse(text)
    .then((ast) => {
      console.log(ast.channels);
      return ast.channels
    })
    .then((result) => {
      for (var i = 0; i < result.length; i++){
        result[i] = result[i].replace(/[^a-zA-Z0-9 ]/g, "");
      }
      for (var i = 0; i < result.length; i++){
        slack.getChannelInfo(token, result[i]);
      };
    })
	  .catch((err) => {
	    console.log(err);
	  });
};

exports.onlyrecap = (message) => {
    console.log("Only recap intitated");
    let { channel, text, user, username, ts } = message;
    slack.im(token, user)
      .then((result) => {
        if(result.channel.id == channel){
            username = "recaptain";
            
            let message = {
                username: "recaptain",
                channel: result.channel.id,
                text: "",
                attach: [{
                    text: "#marketing",
                    color: "#36af4f",
                    title: "What channel(s) would you like recapped?"
                }]
            }
            return slack.post(token, message.channel, message.text, icon, message.username, message.attach);
        }
        else console.log("not a dm");
        })  
};

exports.help = (message, ast) => {
    console.log("they initiated help"); 
    let { channel, text, user, username, ts } = message;
    getHandle(token, user)
        .then((result) => {
            return name = result;
        })
        .then((result) => {
            return slack.im(token, user)
        })
        .then((result) => {
           if(result.channel.id == channel) {
           channel = result.channel.id;
           username = "recaptain";
           text = ("Hey" + name  + ", Heard you needed help!");

           attach =  [{"title": "How to use me", "text": "All you have to do is type in recap", "color": "#36a64f"}]
           slack.post(token, channel, text, icon, username, attach)

        }
       })
       .catch((err) => {
         console.log(err);
       });
};

function getHandle(token, user) {
  return new Promise((resolve, reject) => {
    slack.userdata(token, user) 
      .then((result) => {
        name = JSON.stringify(result.user.name);
        console.log(name);
        resolve(name);
        //return name;
      });
  });
};
