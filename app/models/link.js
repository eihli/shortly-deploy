var db = require('../config');
var crypto = require('crypto');
var mongoose = require('../config');

var linkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  fav_icon: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now }
});

linkSchema.pre('save', function(next) {
  var link = this;
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Links = mongoose.model('Link', linkSchema);

module.exports = Links;
