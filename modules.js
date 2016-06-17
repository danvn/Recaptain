var _ = require('lodash');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve(_.filter(messages, (e) => {
        return e.text.contains(message.user);
    }));
  });
};

exports.keyword = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve('keywords');
  });
};
