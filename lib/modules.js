var _ = require('lodash');
var moment = require('moment');

exports.mentions = (messages, message, ast) => {
  return new Promise((resolve, reject) => {
    let list = _.chain(messages)
          .filter((e) => e.text.includes(message.user))
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
    let list = _.chain(messages)

          .filter((e) => e.text.includes('http'))
          .map((e) => e.text)
          .value();

    let response = "We could not find any links";

    if (list.length > 0) {
      response = _.join(list, '\n');
    }
    resolve(response);
  });
};

exports.keyword = (messages, message, keywords) => {
  return new Promise((resolve, reject) => {
    let list = _.chain(messages)
          .filter((e) => checkKeywords(e, keywords))
          .map((e) => moment.duration(-((moment().unix())-e.ts), "seconds").humanize(true) + " | " + "<@" + e.user + ">: " + e.text)
          .reverse()
          .value();

    let response = "We could not find any messages which match " + _.join(keywords, ', ');

    if (list.length > 0) {
      response = _.join(list, '\n');
    }

    resolve(response);
  });
};

var checkKeywords = (message, keywords) =>  {
  return _.reduce(keywords, (exists, keyword) => {
	  if (!exists) {
      return message.text.toLowerCase().includes(keyword.text.toLowerCase());
	  } else {
		  return exists;
	  }
	}, false);
};
