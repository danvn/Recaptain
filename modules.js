var _ = require('lodash');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    let list = _.chain(messages)
          .filter((e) => e.text.includes(message.user))
          .take(5)
          .map((e) => "<@" + e.user + ">"  + ': ' + e.text)
          .value();

    let response = "We could not find any mentions of you.";

    if (list.length > 0) {
      response = _.join(list, '\n');
    }

    resolve(response);
  });
};

exports.links = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    
  });
};

exports.keyword = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    let list = _.chain(messages)
        .filter((e) => _.reduce(ast.keywords, (exists, keyword) => {
	    if (!exists) {
		return e.text.includes(keyword);
	    } else {
		return exists;
	    }
	}, false))
          .take(5)
          .map((e) => e.text)
          .value();

    let response = "We could not find any messages which match " + _.join(ast.keywords, ', ');

    if (list.length > 0) {
      response = _.join(list, '\n');
    }

    resolve(response);
  });
};
