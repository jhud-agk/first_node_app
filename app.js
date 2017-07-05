const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');



mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', ()=>{
	console.log('connected to mongoDB');
})

// check  for db errors
db.on ('error',(err) =>  {
	console.log(err);
});  

//Init App
const app = express();

//bring in models
let Article = require('./models/article');


//load view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//set public folder
app.use(express.static(path.join(__dirname,'public')));

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



//Home route
app.get('/', (req,res)=>{
	Article.find({} , (err, articles) =>{
		if( err ){
			console.log( err );
		}
		else{
			res.render('index', {
			title: 'Articles',
			articles:articles
			});
		}
		
	});
});


// route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);


// start server
app.listen(3000,()=>{
	console.log('server started on port 3000');
});