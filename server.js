var express         = require('express');
var mongoose        = require('mongoose');
var port            = 3000;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();
var user 			= require('./app/routes/user')();
var query 			= require('./app/routes/query')();

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
			}; 
mongoose.connect('mongodb://admin:admin@ds015849.mlab.com:15849/googlemap', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Serve static files
app.use(express.static(__dirname + '/public')); 
// log with Morgan
app.use(morgan('dev'));  
                                       
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse 

app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

//Get and Post users
app.route("/users")
	.get(user.get)
	.post(user.post);

// Retrieves JSON records for all users who meet a certain set of query conditions.
app.post('/query/', query.post);

app.listen(port);
console.log('App listening on port ' + port);
