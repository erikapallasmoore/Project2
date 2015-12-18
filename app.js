var express = require('express');
var session = require('express-session');
var	ejsLayouts = require('express-ejs-layouts');
var	bodyParser = require('body-parser');
var	requestModule = require('request');
var flash = require('connect-flash');
var db = require('./models');
var passport = require('passport');
var strategies = require('./config/strategies');
var instagram = require('instagram-node').instagram();
var client_id = process.env.INSTAGRAM_APP_ID;
var cleint_secret = process.env.INSTAGRAM_APP_SECRET
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
	// console.log('req.user is', req.user);
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.get('/instagram', function(request, response) {
	response.render('instagram');
});

/////////////////////////////////////Instagram Search Test ////////////////////////////////////
///////////////working - displays all instagram tag names associated with the search////////////

app.get('/instagram/search', function(request, response) {
    var query = request.query.search;
    var lat = request.query.latitude;
    var lng = request.query.longitude;
    var token;
    db.provider.findOne().then(function(provider) {
        token = provider.token;

        var url = 'https://api.instagram.com/v1/media/search?lat=' + lat +'&lng='+ lng + '&distance=5000&access_token=' + process.env.INSTAGRAM_TOKEN;
    console.log(url);
        requestModule(url, function(err, resp, body) {
            var data = JSON.parse(body);
            console.log(data)
            if (!err && resp.statusCode === 200) {
              //response.send(data)

               // response.render('images', {tags: data.data});
               response.send(data);
              // for reference - https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
            } else {
              response.render('error');
            }
        });
    });
    // instagram.tag_media_recent(request.query.serach, function(err, medias, pagination){
    //   console.log(medias)
    // })
});

app.get('/api', function(request, response) {
    var query = request.query.search;
    var lat = request.query.latitude;
    var lng = request.query.longitude;
    var token;
    db.provider.findOne().then(function(provider) {
        token = provider.token;
                   var url = 'https://api.instagram.com/v1/media/search?lat=47.6079313&lng=-122.33601179999998&distance=5000&access_token=190598825.2abce53.77ed7791dab7429880a63c2ec08218f8'
    console.log(url);
        requestModule(url, function(err, resp, body) {
            var data = JSON.parse(body);
            console.log(data)
            if (!err && resp.statusCode === 200) {
              response.send(data)
              // response.render('images', {tags: data.data});
              // for reference - https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
            } else {
              response.render('error');
            }
        });
    });
    // instagram.tag_media_recent(request.query.serach, function(err, medias, pagination){
    //   console.log(medias)
    // })
});



///////below code is working but instagram API is depricated////////

// app.get('/instagram/search', function(request, response) {
//     var query = request.query.search;

//     var token;
//     db.provider.findOne().then(function(provider) {
//         token = provider.token;

//         var url = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?access_token=' + token + '&min_tag_id=1387332980547';
//         requestModule(url, function(err, resp, body) {
//             var data = JSON.parse(body);
//             console.log(data)
//             if (!err && resp.statusCode === 200) {
//               // response.render('images', {tags: data.data});
//               response.send(data)
//             } else {
//               response.render('error');
//             }
//         });
//     });
// });


// app.get('/instagram/search/:id', function(request, response) {

//   var searchQuery = request.query.q ? request.query.q : '';
//   var imdbID = request.params.imdbID;
//   requestModule('https://api.instagram.com/v1/tags/search?q=' +  + user.id, function(err, resp, body) {
//     response.render('show', {insta: JSON.parse(body), q: searchQuery});
//   });
// });

// router.get("/:id/archive/:idx", function(req, res) {
//     if (req.user.id == req.params.id) {
//         var userId = req.params.id;
//         var photoId = req.params.idx;
//         db.user.findById(userId).then(function(user) {
//             db.image.findById({
//                 where: {
//                     id: photoId,
//                     userId: userId
//                 }


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




app.use('/', require('./controllers/index'));
app.use('/auth', require('./controllers/auth'));

app.listen(3000);