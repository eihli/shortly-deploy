var mongoose = require('mongoose');
var dbUri = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/shortly';
mongoose.connect(dbUri);

module.exports = mongoose;
