var http = require('http');
var parse = require('url').parse;
var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {});

mongoose.connect('mongodb://localhost/test');

var shortenerSchema = new mongoose.Schema({
    m_long_url: { type: String }
    , m_short_url: String
    , m_hash_key: String
});
var ShortUrl = mongoose.model('ShortUrl', shortenerSchema);
var SERVER = '127.0.0.1';
var PORT = 8080;
var id = 0; 
var url_to_index = new Array();
var short_to_url = new Array();
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';
 
function num_to_base62(n) {
    if(n > 62) {
        return num_to_base62(Math.floor(n / 62)) + CHARS[n % 62];
    } else {
        return CHARS[n];
    }
}
 
var srv = http.createServer(function(req, res) {
    var param = parse(req.url, true);
 
    if (param.pathname == '/short') {
        if (param.query.url != undefined) { 
            short_url = url_to_index[param.query.url];
            if (short_url == undefined) { 
                short_url = num_to_base62(id);
                while (short_url.length < 5) { 
                    short_url = CHARS[0] + short_url;
                }
                url_to_index[param.query.url] = short_url;
                short_to_url[short_url] = param.query.url;
                id++;
            }
            var s_url = new ShortUrl({
               m_long_url: param.query.url
             , m_short_url: short_url
            });

             s_url.save(function(err, thor) {
              if (err) return console.error(err);
                console.dir(s_url);
             });

            res.writeHead(200, {'Content-Type': 'text/html'});
            short_url_string = 'http://' + SERVER + ':' + PORT + 
                               '/' + short_url;
            res.end('Your short url is: <a href="' + short_url_string +
                '">' + short_url_string + '</a>');
        }
    } else { 
        long_url = short_to_url[param.pathname.substring(1)];
        if (long_url != undefined) {
            res.writeHead(302, {'Location': long_url});
            res.end();
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 - Requested url not found');
        }
    }
}).listen(PORT, SERVER);
 
console.log('Server running at http://' + SERVER + ':' + PORT + '/');