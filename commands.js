exports.recap = (message, ast) => {
  let { channel, text, user, username, ts } = message;
  if(GetFirstWord(text) == "<@U1GF1N0CQ>:") {
       console.log(">> New @recaptain mention instance:");
       console.log("    --> userid: " + user);
       console.log("    --> timestamp: " + ts);
       // Convert userid --> handle
       slack.users.info({token, user}, (err,data) => {
       console.log("       |\n       --> @" + data.user.name + ": " + text + "\n");
         var handle = data.user.name; 
       });

    //Get string without bot mention
    var myString = text; // Message body
    myString = myString.replace('<@U1GF1N0CQ>: ','');   
    console.log("Message: " + myString);

    if(result.mentions == true)
      console.log("You had mentions");

    if(result.links == true)
      console.log("You had links");


    //Open IM if there isn't already one
    slack.im.open({token, user}, (err, data) => {
      channel = data.channel.id;
      username = "recaptain";

      // Reply posts go here based on what they ask for. 
      slack.chat.postMessage({token, channel, username, icon_url: "https://avatars.slack-edge.com/2016-06-13/50511039062_3e2a383deda13028950f_32.png", 
                              text: JSON.stringify(result),
                              attachments: '[{"title": "Title", "text": "messages go here \n \n \n \n \n ", "color": "#78CD22"}]'}, (a, data) => 
                             console.log("@"+ getHandle(user) + ": " + text));
    })
  };
}

exports.help = () => {
  
}


