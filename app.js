var express = require('express');
var session = require('express-session');
var	ejsLayouts = require('express-ejs-layouts');
var	bodyParser = require('body-parser');
var	requestModule = require('request');
var flash = require('connect-flash');
var db = require('./models');
var passport = require('passport');
var strategies = require('./config/strategies');
var api = require('instagram-node').instagram();
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
//////////////////// Instagram Login ///////////////////
app.use(passport.initialize());
app.use(passport.session());

//passport.use(strategies.localStrategy);
passport.use(strategies.instagramStrategy);

passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

app.use(function(req,res,next){
	console.log('req.user is', req.user);
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});


// // ************instagram signin*******************************
// app.get('/auth/instagram', passport.authenticate('instagram'));

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

///////////Search////////////////


app.get('/movies', function(request, response) {
  var query = request.query.q;
  requestModule('http://www.omdbapi.com/?s=' + query, function(err, resp, body) {
    var data = JSON.parse(body);
    if (!err && response.statusCode === 200 && data.Search) {
      response.render('movies', {movies: data.Search, q: query});
    } else {
      response.render('error');
    }
  });
});


app.get('/movies/:imdbID', function(request, response) {
  // res.send(req.params.imdbID);
  var searchQuery = request.query.q ? request.query.q : '';
  var imdbID = request.params.imdbID;
  requestModule('http://www.omdbapi.com/?i=' + imdbID, function(err, resp, body) {
    response.render('show', {movie: JSON.parse(body), q: searchQuery});
  });
});

app.use('/', require('./controllers/index'));
app.use('/auth', require('./controllers/auth'));

app.listen(3000);