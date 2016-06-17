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

