var slack = require('slack');
var token = process.env.token;
var parse = require('./parse');

exports.recap = (message, ast) => {
  let { channel, text, user, username, ts } = message;
  if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
    //Get string without bot mention
    var myString = text; // Message body
    myString = myString.replace('<@U1GF1N0CQ>: ','');   
    console.log("Message: " + myString);

    //check mentions and links
    if(ast.mentions == true)
      console.log("You had mentions");

    if(ast.links == true)
      console.log("You had links");
    console.log("BEFORE THE FUNCTION ->>>" + channel);

    getHistory(channel)
        .then((result) => {
            console.log(result);
     slack.im.open({token, user}, (err, data) => {
      channel = data.channel.id;
      username = "recaptain";
      
      // Reply posts go here based on what they ask for. 
      slack.chat.postMessage({token, channel, username, icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png", 
                              text: JSON.stringify(ast),
                              attachments: '[{"title": "Title", "text": "messages go here \n \n \n \n \n ", "color": "#78CD22"}]'}, (a, data) => 
                             console.log("@"+ getHandle(user) + ": " + text));
    })
    })
    .catch((err) => {
        console.log(err);
    });
    //Open IM if there isn't already one
};
};

exports.help = (message, ast) => {
    console.log("they initiated help"); 
    let { channel, text, user, username, ts } = message;

    getHandle(user)
        .then((result) => {
            name = result;

    if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
       slack.im.open({token, user}, (err, data) => {
        channel = data.channel.id;
        username = "recaptain";
        text = ("Hey" + name  + ", Heard you needed help!");

        slack.chat.postMessage({token, channel, username, icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png", 
        attachments: '[{"title": "How to use me", "text": "@recapbot: recap [keywords] [timeframe]", "color": "#36a64f"}, {"title": "Built in keywords", "text": "Mentions: Gets mentions of you with keywords \n Links: Gets links with keywords", "color": "#439FE0"}, {"title": "Example", "text": "@recaptain: links sales from past week \n This gets all the links with the keyword sales from the past week", "color": "#FF6600"}]',
        text}, (a, data) =>
            console.log("helped"));
            })
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


function getHandle(user) {
return new Promise((resolve, reject) => {
    slack.users.info({token, user}, (err, data) => {
        name = JSON.stringify(data.user.name);
        resolve(name);
    })
});
};

function getHistory(channel){
return new Promise((resolve, reject) => {
    console.log("IN FUNCTION ->>>" + channel);
    let c = channel;
    slack.channels.history({token, channel: c}, (err, data) => {
	if (err) reject(err);
	else resolve(data);
    })   
});
};


