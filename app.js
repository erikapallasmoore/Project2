var express = require('express');
var session = require('express-session');
var	ejsLayouts = require('express-ejs-layouts');
var	bodyParser = require('body-parser');
var	requestModule = require('request');
var flash = require('connect-flash');
var db = require('./models');
var passport = require('passport');
var strategies = require('./config/strategies');
var	app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));
app.use(flash());
app.use(session({
  secret: 'sasdlfkajsldfkajweoriw234234ksdfjals23',
  resave: false,
  saveUninitialized: true
}));
/////////////map/////////////////
app.get('/', function(req, res) {
	db.place.findAll().then(function(places){
		res.render('index', {places: places});
	});
});

app.post('/', function(req, res) {

	var newPlace = {
		address: req.body.address
	}

	db.place.create(newPlace).then(function() {
		res.redirect('/');
	});
});

app.get('/map', function(req, res){
	res.render('map');
});

app.use(function(request, response, next) {
  request.session.lastPage = request.header('Referer');
  response.locals.lastPage = request.session.lastPage;
  next();
});
//////////////////// Instagram Login ///////////////////
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategies.localStrategy);
passport.use(strategies.instagramStrategy);

passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.use('/', require('./controllers/index'));
app.use('/auth', require('./controllers/auth'));

app.listen(3000);