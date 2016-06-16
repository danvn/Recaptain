var _ = require('lodash');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    

    resolve('mentions');
  });
};

exports.keyword = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve('keywords');
  });
};
