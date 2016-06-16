var moment = require('moment');
var nlp = require('nlp-toolkit');

module.exports = (text) => {
  return new Promise((resolve) => {
    let ast = {
      keywords: [],
      mentions: false,
      links: false,
      date: null
    };

    let date = parseDate(text);
    if (date) {
      text = text.replace(date.regex, '');
      ast.date = date.date;
    }

    let modules = parseModules(text, ast);
    for(let m of modules) {
      text = text.replace(m[0], '');
      ast[m[1]] = true;
    }

    nlp.stopwords(nlp.tokenizer(text), { defaultLang: 'en'  })
      .then((res) => {
        console.log(res);
        ast.keywords = text.split(' ');
        resolve(ast);
      });
  });
};

function parseModules(text, ast) {
  const regexes = [
    [/links|link/i, 'links'],
    [/mentions|mention/i, 'mentions']
  ];

  let modules = [];
  for(let r of regexes) {
    let res = r[0].exec(text);
    if (res != null) {
      modules.push(r);
    }
  }

  return modules;
}

function parseDate(text) {
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
