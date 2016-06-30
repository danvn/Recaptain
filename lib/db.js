var Rebound = require('reboundodm');

Rebound.connect('elasticsearch:9200');

var messageSchema = Rebound.Schema({
  text: {
    type: String,
    analyzer: 'default'
  },
  ts: Number,
  channel: String,
  user: String,
  team: String
});

exports.message = Rebound.modelIndex('channel', 'message', messageSchema);
