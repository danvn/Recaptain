var token = process.env.token;
var parse = require('./parse');
var modules = require('./modules');
var _ = require('lodash');
var slack = require('./slack');

exports.recap = (message, ast) => {
  let { channel, text, user, username, ts } = message;
  if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
    //Get string without bot mention
    var myString = text; // Message body
    myString = myString.replace('<@U1GF1N0CQ>: ','');   
    console.log("Message: " + myString);


    slack.history(channel, ast.date.time)
	  .then((result) => {
      let modules_list = [];
        //check mentions and links
      if(ast.mentions == true)
        modules_list.push(modules.mentions(result.messages, message, ast));

      if(ast.links == true)
        modules_list.push(modules.keyword(result.messages, message, ast));

        return Promise.all(modules_list);
      })
      .then((result) => {
        //Open IM if there isn't already one
        slack.im(token, user) 
          .then((result) => {
          
          channel = result.channel.id;
          username = "recaptain";
          icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png";
          text =  "HEY";
          attach = '[{"title": "Title", "text": "messages go here \n \n \n \n \n ", "color": "#78CD22"}]';  

          slack.post(token, channel, text, icon, username, attach)
            .then((result) => {
                console.log("message posted");
            });    
          });

        
      })
	  .catch((err) => {
	      console.log(err);
	  });
  };
};

exports.help = (message, ast) => {
    console.log("they initiated help"); 
    let { channel, text, user, username, ts } = message;

    getHandle(token, user)
        .then((result) => {
            name = result;

            if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
                slack.im(token, user)
                  .then((result) => {
                    channel = result.channel.id;
                    username = "recaptain";
                    text = ("Hey" + name  + ", Heard you needed help!");
                    icon = "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png"; 
                    attach =  '[{"title": "How to use me", "text": "@recapbot: recap [keywords] [timeframe]", "color": "#36a64f"}, {"title": "Built in keywords", "text": "Mentions: Gets mentions of you with keywords \n Links: Gets links with keywords", "color": "#439FE0"}, {"title": "Example", "text": "@recaptain: links sales from past week \n This gets all the links with the keyword sales from the past week", "color": "#FF6600"}]';
                    slack.post(token, channel, text, icon, username, attach)
                      .then((result) => {
                        console.log("helped");
                      });
                    });
            };
       })
       .catch((err) => {
         console.log(err);
       });
}

function GetFirstWord(str) {
    if (str.indexOf(' ' ) == -1)
        return str;
    else
        return str.substr(0, str.indexOf(' ' ));
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

