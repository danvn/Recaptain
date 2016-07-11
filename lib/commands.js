var token = process.env.token;
var parse = require('./parse');
var modules = require('./modules');
var _ = require('lodash');
var slack = require('./slack');
var parse = require('./parse');
var watson = require('./watson');
var moment = require('moment');
var excuse = require('huh');

var icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png";

// Handles the `recap` command
exports.recap = (message) => {
  let { channel, text, user, username, ts } = message;
  console.log("TXT: ", text);

  parse(text)
    .then((ast) => {
      if (ast.channels.length != 0) return ast
      else return Promise.reject("Please Enter Channels! For example, you should use me like this... \n> ```recap #channel1 #channel2 #channel3```");
    })
    // Store channel ID's
    // Strip special characters
    .then((result) => {
      for (var i = 0; i < result.channels.length; i++){
        if (/\|+.*>/.test(result.channels[i]) == true){
          console.log("mobile request");
          result.channels[i] = result.channels[i].replace(/\|[a-zA-Z]*>/i, "");
        }
        result.channels[i] = result.channels[i].replace(/[^a-zA-Z0-9 ]/g, "");
      }
      return result
    })
    // Fetch and store channel history for every entry in channel ID array
    .then((result) => {
        let history_list = [];
        let channel_names = [];
        for (var i = 0; i < result.channels.length; i++){
          console.log("fetching history of " + result.channels[i]);
          getHandle(user)
          // name = JSON.stringify(user);
          // name = name.replace(/[^a-zA-Z0-9 ]/g, "")
          // console.log(name);
          // console.log(user)
          history_list.push(slack.history(result.channels[i], result.date));
          channel_names.push(result.channels[i]);
        }
        return Promise.all([Promise.all(history_list), Promise.all(channel_names)]);
    }) 
    // Apply watson on the messages to determine relative relevance
    .then((history) => {
      let [history_list, channel_names] = history;
      console.log("CHANNEL" , channel_names);
      return Promise.all(_.map(history_list, (messages, i) => {
        let l = _.chain(messages)
          .filter((es) => !/has joined the channel/i.test(es.text))
          .map((esta) => {
            return esta.text;
          })
          .value();

        let text = _.join(l, '\n');

        return watson.get_keywords(text)
          .then((res) => {
            return {
              result: _.filter(res.keywords, (e) => {
                if (e.relevance < 0.85) {
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
            // console.log("CHEKCING")
            // console.log(res)
            // console.log()
            return {
              result : res, 
              channel_name: e.channel_name,
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
        let message = {
          username: "recaptain",
          channel: channel,
          text: "",
          attach: [{
            title: "<\#" + result[i].channel_name + ">",
            color: "#5F9F9F",
            text: (result[i].result),
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
            title: "ERROR: " + excuse.get(),
            text: err,
            color: "#FF0000",
            mrkdwn_in: [
                "text",
                "title"
                ]
            }]
         }
        slack.post(message.channel, message.text, icon, message.username, message.attach);
     })
	 });
};

exports.help = (message, ast) => {
    let { channel, text, user, username, ts, general } = message;
    console.log("Help Request Initiated"); 
    // console.log('printed to channel', general)
    getGeneralChannel(token)
      .then((result) => {
        return general = result;
      })
      .then(getHandle(user)
        .then((result) => {
            return name = result;
        }))
        .then((result) => {
            return slack.im(user)
        })
        .then((result) => {
           if(result.channel.id == channel) {
           channel = result.channel.id;
           username = "recaptain";
<<<<<<< HEAD
           text = ("Hey " + name  + ", I'm here to help you recap channels, so you don't have to read everything.\n:robot_face: I'm a direct message robot\n:speaking_head_in_silhouette:You can tell me to do things here!\n:memo:Take a minute to help out our team from this short survey: https://www.surveymonkey.com/r/DSSNDSC");
           attach =  [{"title": "How to use me:", 
            "text": "To get a recap of one channel, send me this command:\n>```recap #channel_name1```\nor for multiple channels. You can even specify a time! Search for either the 'past hour', 'past day', or 'past week'. Just make sure there is something for Recaptian to find in the time range.\n>```recap #channel_name1 #channel_name2 past 3 days```\nin this text box :point_down: to get a summary of the channels you entered.",
=======
           text = ("Hey " + name + ", I'm here to help you recap channels, so you don't have to read everything.\n:robot_face: I'm a direct message robot\n:speaking_head_in_silhouette:You can tell me to do things here!\n");
           attach =  [{"title": "For Example:", 
            "text": "To get a recap of the " + general + " channel, send me this command:\n>```recap <#C1MCA2P9V>```\nYou can choose whichever channel you'd like.\nI can even understand specific times! Just tell me when with 'past hour', 'past day', or 'past week' at the end of your request.\n>```recap #general #random #otherChannels past 3 days```\nin this text box :point_down: to get a summary of the channels you entered.",
>>>>>>> 7410cd5ed8f0c362194fea13b1820d70cea78133
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
        console.log();
        console.log("   USER NAME: ")
        console.log(name);
        console.log()
        resolve(name);
        //return name;
      });
  });
};

function getGeneralChannel(token) {
  return new Promise((resolve, reject) => {
    slack.getGeneralChannel(token) 
      .then((result) => {
        general = result;
        general = general.replace(/[^a-zA-Z0-9 ]/g, "")
        general = "<#" + general + ">"
        console.log('getGeneralChannel Function: ', general);
        resolve(general);
      });
  });
};

