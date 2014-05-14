// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var parse = require('url').parse;

// configuration
mongoose.connect('mongodb://localhost/urls'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var iteration = 0; // just for now
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';
var port = process.env.PORT || 8080;        // set our port
var ShortUrl = require('./models/ShortUrl'); // model used to store short urls

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});


// on routes that end in /short (verb = action)
// ----------------------------------------------------
router.route('/short').get(function(req, res) {

		// FIX that's unfortunate -> having a query paramter required
		var param = parse(req.url, true);
		if (param.query.url != undefined) { 

			var longUrl = param.query.url;
			// Hash Generation - will be improved later.
			var hash = getHash();
			// Get Full URL - To be improved.
			var fullUrl = req.protocol + '://' + req.get('host') + '/' + hash;

			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end('Your short url is: <a href="' + fullUrl +'">' + fullUrl + '</a>');
	}

});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here


// other functions
 
function numToBase62(n) {
    if(n > 62) {
        return numToBase62(Math.floor(n / 62)) + CHARS[n % 62];
    } else {
        return CHARS[n];
    }
}

function getHash(){
	var hash = numToBase62(iteration);
	while (hash.length < 5){
		hash = CHARS[0] + hash;
	}
	iteration++;
	return hash;
}


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);