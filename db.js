var Rebound = require('reboundodm');

Rebound.connect('elasticsearch:9200');


var messageSchema = Rebound.Schema({
  text: {
    type: String,
    analyzer: 'not_analyzed'
  }
});

var message = Rebound.modelIndex('channel', 'message', messageSchema);

/*message.create({
  text: "hello world",
  ts: new Date().getTime() / 1000
})*/
