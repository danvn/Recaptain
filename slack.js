var slack = require('slack');
var token = process.env.token;
var _ = require('lodash');
var moment = require('moment');

function history(channel, oldest) {
  return new Promise((resolve, reject) => {
    slack.channels.history({token, channel, oldest: (oldest.toDate().getTime() / 1000)}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

var history_recursive = (channel, arr) => (result) => {
  arr = _.concat(arr, result.messages);
  if (result.has_more) {
    var last_msg_time = result.messages[0].ts;
    return history(channel, moment.unix(last_msg_time))
      .then(history_recursive(channel, arr));
  } else {
    return arr;
  };
};

exports.history = (channel, oldest) => {
  if (!oldest) oldest = moment().subtract(1, 'weeks');

  return history(channel, oldest)
    .then(history_recursive(channel, []))
    .then((result) => _.filter(result, (e) => e.text != null))
    // .then((result) => console.log(result));
};

exports.im = (user) => {
  return new Promise((resolve, reject) => {
    slack.im.open({token, user}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.post = (channel, text, icon, username, attach) => {
  return new Promise((resolve, reject) => {
    slack.chat.postMessage({channel, text, icon_url: icon, username, attachments: JSON.stringify(attach)}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.userdata = (user) => {
  return new Promise((resolve, reject) => {
    slack.users.info({token, user}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.joinChannel = (name) => {
  return new Promise((resolve, reject) => {
    slack.channels.join({token, name}, (err, data)=> {
      if (err) reject(err);
      else resolve(data);
      console.log("Joining channel: " + name);
    });
  });
};

exports.getMembers = (channel) => {
  return new Promise((resolve, reject) => {
    slack.channels.info({token, channel}, (err, data)=> {
      if (err) reject (err);
      else {
      console.log("Channel members: " + data.channel.members);
      resolve (data.channel.members);
      };
    });
  });
};


