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
  console.log("TXT: ", text);

  parse(text)
    .then((ast) => {
      if (ast.channels.length != 0) return ast.channels
      else return Promise.reject("Please Enter Channels! For example, you should use me like this... \n recap #channel1 #channel2 #channel3");
    })
    .then((result) => {
      // Strip special characters
      for (var i = 0; i < result.length; i++){
        result[i] = result[i].replace(/[^a-zA-Z0-9 ]/g, "");
      }
      return result
    })
    .then((result) => {
        let history_list = [];
        console.log(result);
        for (var i = 0; i < result.length; i++){
          console.log("fetching history of " + result[i]);
          history_list.push(slack.history(result[i]));
        }
        return Promise.all(history_list);
    }) 
    .then((history_list) => {
      console.log(history_list);

      return Promise.all(_.map(history_list, (e) => {
        let messages = _.map(e, (esta) => {
          return esta.text;
        });

        let text = _.join(messages, '\n');

        console.log(text) 
        return watson.get_keywords(text);

      }));
    })
    .then((result) => {
      let message = {
        username: "recaptain",
        channel: channel,
        text: JSON.stringify(result)
      };

      return slack.post(message.channel, message.text, icon, message.username, message.attach);
})
 
	  .catch((err) => {
      console.log(err);
      slack.im(user)
        .then((result) => {
        console.log("in promise");
        let message = {
        username: "recaptain",
        channel: result.channel.id,
        text: "",
            attach: [{
            title: "Whoops!",
            color: "#FF0000",
            text: err
            }]
         }
        slack.post(message.channel, message.text, icon, message.username, message.attach);
     })
	 });
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
           text = ("Hey " + name  + ", heard you needed help!");

           attach =  [{"title": "How to use me:", "text": "type 'recap #channel_name1 #channel_name2 ...' to get a summary of the channels", "color": "#36a64f"}]
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
        name = name.replace(/[^a-zA-Z0-9 ]/g, "")
        console.log(name);
        resolve(name);
        //return name;
      });
  });
};

