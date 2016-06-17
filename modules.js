var _ = require('lodash');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve(_.chain(messages)
            .filter((e) => e.text.includes(message.user.id))
            .take(5)
            .map((e) => e.username + ': ' + e.text)
            .join('\n')
            .value()
           );
  });
};

exports.keyword = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve(_.chain(messages)
            .filter((e) => _.reduce(ast.keywords, (exists, e) => !exists ? e.text.includes(e) : true, false))
            .take(5)
            .map((e) => e.text)
            .join('\n')
            .value()
           );
  });
};
