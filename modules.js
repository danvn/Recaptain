var _ = require('lodash');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    let list = _.chain(messages)
          .filter((e) => e.text.includes(message.user.id))
          .take(5)
          .map((e) => e.username + ': ' + e.text)
          .value();

    let response = "We could not find any mentions of you.";

    if (list.length > 0) {
      response = _.join(messages, '\n');
    }

    resolve(response);
  });
};

exports.keyword = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    let list = _.chain(messages)
          .filter((e) => _.reduce(ast.keywords, (exists, e) => !exists ? e.text.includes(e) : true, false))
          .take(5)
          .map((e) => e.text);

    let response = "We could not find any messages which match " + _.join(ast.keywords, ', ');

    if (list.length > 0) {
      response = _.join(messages, '\n');
    }

    resolve(response);
  });
};
