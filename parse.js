var moment = require('moment');

module.exports = (text) => {
  return new Promise((resolve) => {
    let ast = {
      keywords: [],
      mentions: false,
      links: false,
      date: null
    };

    let date = matchDate(text);
    text = text.replace(date.regex, '');
    ast.date = date.date;

    resolve(ast);
  });
};

function matchDate(text) {
  const regexes = [
    [/([0-9])\s(?:hour|hours|h|hr)/i, (res) => moment().subtract(res[1], 'hours')],
    [/past\s(?:hour|hours|h|hr)/i, (res) => moment().subtract(1, 'hours')],
    [/([0-9])\s(?:day|days|d)/i, (res) => moment().subtract(res[1], 'days')],
    [/past\s(?:day|days|d)/i, (res) => moment().subtract(1, 'days')],
    [/([0-9])\s(?:week|weeks|w)/i, (res) => moment().subtract(res[1], 'weeks')],
    [/past\s(?:week|weeks|w)/i, (res) => moment().subtract(1, 'weeks')]
  ];

  for(let r of regexes) {
    let res = r[0].exec(text);
    if (res != null) {
      return {
        date: r[1](res),
        regex: r[0]
      };
    }
  }


  return null;
}
