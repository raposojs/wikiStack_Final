var express = require('express')
var app = express();
var wikiRoutes = require('./routes/wiki')
var usersRoutes = require('./routes/users')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var swig = require('swig')

var models = require('./models')
var User = models.User
var Page = models.Page


// SETUP MIDDLEWARE
app.use(morgan('dev'))

// SETUP BODY PARSING
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// STATIC ROUTING
app.use(express.static(__dirname + './public'))
app.use(express.static(__dirname + './node_modules'))

//SETUP VIEW ENGINE (SWIG)
app.engine('html', swig.renderFile)
swig.setDefaults({cache:false})
app.set('view engine', 'html')
app.set('views', __dirname + '/views')


//ROUTE EVERYTHING THAT COMES TO /WIKI/ and /USERS/ TO WIKI OR USERS ROUTER
app.use('/wiki', wikiRoutes)
app.use('/users', usersRoutes)

//ERROR HANDLER
app.use(function(err,req,res,next){
	console.log(err);
	res.status(500).send(err.message)
})

//SYNC DATABASE WITH MODELS
User.sync({force:false})
	.then(function(){
		return Page.sync({force:false});
	})
	.then(function(){
		app.listen(3003, function(){
			console.log("Listening on port 3003")		
		})
	})

// SETUP PORT TO LISTEN TO REQUESTS
// app.listen(3003, function(){
// 	console.log("Listening on port 3003")
// })