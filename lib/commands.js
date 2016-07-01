var token = process.env.token;
var parse = require('./parse');
var modules = require('./modules');
var _ = require('lodash');
var slack = require('./slack');
var parse = require('./parse');
var watson = require('./watson');
var moment = require('moment');

var icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png";

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
        let channel_names = [];
        for (var i = 0; i < result.length; i++){
          console.log("fetching history of " + result[i]);

          history_list.push(slack.history(result[i]));
          channel_names.push(result[i]);
        }

        return Promise.all([Promise.all(history_list), Promise.all(channel_names)]);
    }) 
    .then((history) => {
      let [history_list, channel_names] = history;
      console.log("CHANNEL" , channel_names);
      return Promise.all(_.map(history_list, (messages, i) => {
        let text = _.join(_.map(messages, (esta) => {
          return esta.text;
        }), '\n');

        return watson.get_keywords(text)
          .then((res) => {
            return {
              result: _.filter(res.keywords, (e) => {
                if (e.relevance < 0.9) {
                  return false;
                } else {
                  return true;
                }
              }),
              messages,
              channel_name: channel_names[i]
            };
          });

      }));
    })
    .then((result) => {
      return Promise.all(_.map(result, (e) => {
        return modules.keyword(e.messages, message, e.result)
          .then((res) => {
            return {
              result : res, 
              channel_name: e.channel_name
            }
          });
      }));
    })
    .then((result) => {
      let attach_message = [];
      for (i = 0; i<result.length; i++){
        attach_message.push(result[i]);
      }
      return Promise.all(attach_message);
    })
    .then((result) => {
      var arr = [];
      for (i = 0; i<result.length; i++){
        result[i].result = ">" + result[i].result.replace(/(\r\n|\n|\r)/gm,"\n>");
        console.log(result[i].result);
        let message = {
          username: "recaptain",
          channel: channel,
          text: "",
          attach: [{
            title: "<\#" + result[i].channel_name + ">",
            color: "#5F9F9F",
            text: ("*older messages* \n" + result[i].result + "\n*more recent messages*"),
            mrkdwn_in: [
              "text",
              "title"
              ]
          }]
        };

        arr.push(slack.post(message.channel, message.text, icon, message.username, message.attach));
      }
      return Promise.all(arr);
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
           text = ("Hey " + name  + ", I'm here to help you recap channels, so you don't have to read everything.\n:robot_face: I'm a direct message robot\n:speaking_head_in_silhouette:You can tell me to do things here!\n");

           attach =  [{"title": "How to use me:", 
            "text": "To get a recap of one channel, send me this command:\n>```recap #channel_name1```\nor for multiple channels\n>```recap #channel_name1 #channel_name2 ...``` \nin the text box below :point_down: to get a summary of the channels you entered.",
            "color": "#36a64f",
            "mrkdwn_in": [
              "text",
              "title"
              ]
            }]
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

