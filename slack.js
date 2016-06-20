var slack = require('slack');
var token = process.env.token;

exports.history = (channel, oldest) => {
  return new Promise((resolve, reject) => {
    slack.channels.history({token, channel, oldest: (oldest.toDate().getTime() / 1000)}, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }); 
    });
};


exports.im = (token, user) => {
  return new Promise((resolve, reject) => {
      slack.im.open({token, user}, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
  });
};

exports.post = (token, channel, text, icon, username, attach) => {
    return new Promise((resolve, reject) => {
      slack.chat.postMessage({token, channel, text, icon_url: icon, username, attachments: JSON.stringify(attach)}, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
};

exports.userdata = (token, user) => {
    return new Promise((resolve, reject) => {
      slack.users.info({token, user}, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
});
};
