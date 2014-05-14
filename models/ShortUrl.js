var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UrlsSchema   = new Schema({
    mHash: String,
    mLongUrl: String,
    mShortUrl: String
});

module.exports = mongoose.model('ShortUrl', UrlsSchema);
