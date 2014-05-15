// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var parse = require('url').parse;

// configuration
mongoose.connect('mongodb://localhost/urls'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST (later on)
app.use(bodyParser());

var iteration = 0; // just for now
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';
var port = process.env.PORT || 8080;        // set our port
var ShortUrl = require('./models/ShortUrl'); // model used to store short urls
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests (kinda request interceptor)
router.use(function(req, res, next) {
	// do logging
	console.log('Request Filtered!');
	next();
});


// GET /api/short?url=<your_url> (verb = action)
// ----------------------------------------------------
router.route('/api/short').get(function(req, res) {

		// FIX that's unfortunate -> having a query paramter required
		var param = parse(req.url, true);
		if (param.query.url != undefined) { 

			var longUrl = param.query.url;
			var hash = getHash();
			var shortUrl = req.protocol + '://' + req.get('host') + '/' + hash;

			// Saving @Mongo
			var NewShortUrl = new ShortUrl({
				mHash: hash,
				mLongUrl: longUrl,
				mShortUrl: shortUrl
			});

			NewShortUrl.save(function(err, succ) {
				if (err) return console.error(err);
			});

			// crappy response containing the url - will improve later.
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end('Your short url is: <a href="' + shortUrl +'">' + shortUrl + '</a>');
	}
});

// GET / redirects to home page (under construction)
// ----------------------------------------------------
router.get('/', function(req, res) {
	res.json({ message: 'Home page will be here!' });   
});

// GET /:key redirects back to long_url 
// ----------------------------------------------------
router.get('/:key?', function(req, res) {
	var key = req.params.key;
	if(!key){
		res.status(400).send('Invalid paramater');
	}else{

		ShortUrl.findOne({mHash: key}, function(err, data){
			if(err) 
				res.status(404).send('Not found');
			if(data){
				res.redirect(data.mLongUrl);
			}
		});
	}
});

// Helpers / Internal functions
// -----------------------------------------------------
function numToBase62(n) {
	if(n > 62) 
		return numToBase62(Math.floor(n / 62)) + CHARS[n % 62];
	else 
		return CHARS[n];
}

function getHash(){
	var hash = numToBase62(iteration);
	while (hash.length < 5){
		hash = CHARS[0] + hash;
	}
	iteration++;
	return hash;
}


app.use('/', router);
app.listen(port);
console.log('Server running on ' + port);