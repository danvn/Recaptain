var slack = require('slack');
var token = process.env.token;

exports.history = (channel) => { 
    return new Promise((resolve, reject) => {
      let c = channel
      slack.channels.history({token, channel: c}, (err, data) => {
            if (err) reject(err);
            else resolve(data);
}); 
});
};

exports.im = (token, user) => {
    return new Promise((resolve, reject) => {
    slack.im.open({token, user}, (err, data) => {
        resolve(data);
    })
});
};

exports.post = (token, channel, text, icon, username, attach) => {
    return new Promise((resolve, reject) => {
     console.log("in post before slack post");
     slack.chat.postMessage({token, channel, text, icon_url: icon, username, attachments: attach}, (err, data) => {
        console.log("in post");
        resolve();
    });
});   
};

exports.userdata = (token, user) => {
    return new Promise((resolve, reject) => {
    console.log("OUTSIDE SLACK USER FUNCTION " + user);
    slack.users.info({token, user}, (err, data) => {
        resolve(data);
    });
});
};
