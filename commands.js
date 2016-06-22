var token = process.env.token;
var parse = require('./parse');
var modules = require('./modules');
var _ = require('lodash');
var slack = require('./slack');
var parse = require('./parse');

var icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png";

// Handles the `recap` command
exports.recap = (message) => {
  let { channel, text, user, username, ts } = message;
  console.log(text);

  parse(text)
    .then((ast) => slack.history(channel, ast.date)
          .then((result) => {
            return { messages: result.messages, ast };
          }))
	  .then((result) => {
      let { messages, ast } = result;

      let modules_list = [];
      //check mentions and links
      if((ast.mentions == true) && (ast.keywords.length != 0))
        modules_list.push(modules.keymentions(messages, message, ast));
      
      if((ast.mentions == true) && (ast.keywords.length == 0 ))
        modules_list.push(modules.mentions(messages, message, ast));

      if((ast.links == true) && (ast.keywords.length != 0 ))
        modules_list.push(modules.keylinks(messages, message, ast));

      if((ast.links == true) && (ast.keywords.length == 0))
        modules_list.push(modules.links(messages, message, ast));
    
      if((ast.links == true) && (ast.mentions == true) && (ast.keywords.length == 0))
        modules_list.push(modules.mentionLinks(messages, message, ast));

      if((ast.links == true) && (ast.mentions == true) && (ast.keywords.length != 0))
        modules_list.push(modules.keyMentionLinks(messages, message, ast));

      if((ast.links == false) && (ast.mentions == false))
        modules_list.push(modules.keyword(result.messages, message, ast));

      return Promise.all(modules_list);
    })
    .then((module_responses) => slack.im(token, user)
        .then((result) => {
          return { result, module_responses };
        }))
    .then((res) => {
      let { result, module_responses } = res;

      channel = result.channel.id;
      username = "recaptain";
      console.log(module_responses);
    if (typeof module_responses[0] === 'string'){
        attach = _.map(module_responses, (e) => {
        return {
          text: e,
          color: "#36af4f",
          title: "Here is your recap!"
      };      
    })
    };
    if(typeof module_responses[0] === 'object') {
      attachment = module_responses;
      attach = attachment[0];
    };

      return slack.post(token, channel, text, icon, username, attach);
    })
    .then((result) => {
      console.log("message posted: ", result);
    })
	  .catch((err) => {
	    console.log(err);
	  });
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
           channel = result.channel.id;
           username = "recaptain";
           text = ("Hey" + name  + ", Heard you needed help!");

           attach =  [{"title": "How to use me", "text": "@recaptain: recap [keywords] [timeframe]", "color": "#36a64f"}, {"title": "Built in keywords", "text": "Mentions: Gets mentions of you with keywords \n Links: Gets links with keywords", "color": "#439FE0"}, {"title": "Example", "text": "@recaptain: links sales from past week \n This gets all the links with the keyword sales from the past week", "color": "#FF6600"}];
           slack.post(token, channel, text, icon, username, attach)
       })
       .catch((err) => {
         console.log(err);
       });
};

function getHandle(token, user) {
  return new Promise((resolve, reject) => {
    console.log("INSIDE GETHANDLE " + user);
    slack.userdata(token, user) 
      .then((result) => {
        name = JSON.stringify(result.user.name);
        console.log(name);
        resolve(name);
        //return name;
      });
  });
};
