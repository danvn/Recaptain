var _ = require('lodash');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve(_.filter(messages, (e) => {
        return e.text.includes(message.user);
    }));
  });
};

exports.keyword = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    resolve(_.chain(messages)
            .filter((e) => {
              return _.reduce(ast.keywords, (exists, e) => {
                return !exists ? e.text.includes(e) : true;
              }, false);
            })
            .take(5)
            .value()
           );
  });
};
