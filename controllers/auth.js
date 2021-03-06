var express = require('express');
var db = require('../models');
var passport = require('passport');
var router = express.Router();

router.route('/signup')
  .get(function(req, res) {
    res.render('auth/signup');
  })
  .post(function(req, res) {
    if (req.body.password != req.body.password2) {
      req.flash('danger', 'Passwords do not match');
      res.redirect('/auth/signup');
    } else {
      db.user.findOrCreate({
        where: {email: req.body.email},
        defaults: {
          password: req.body.password,
          name: req.body.name
        }
      }).spread(function(user, created) {
        if (created) {
          req.login(user, function(err) {
            if (err) throw err;
            req.flash('success', 'You are signed up and logged in.')
            res.redirect('/');
          });
        } else {
          req.flash('danger', 'A user with that e-mail address already exists.');
          res.redirect('/auth/signup');
        }
      }).catch(function(err) {
        req.flash('danger', err.message);
        res.redirect('/auth/signup');
      });
    }
  });

router.route('/login')
  .get(function(req, res) {
    res.render('auth/login');
  })
  .post(function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if (user) {
        req.login(user, function(err) {
          if (err) throw err;
          req.flash('success', 'You are now logged in.');
          res.redirect('/');
        });
      } else {
        req.flash('danger', 'Error');
        res.redirect('/auth/login');
      }
    })(req, res);
  });

router.get('/login/:provider', function(req, res){
  switch(req.params.provider){
    case 'instagram':
      passport.authenticate(
        req.params.provider,
        {scope: ['basic', 'public_content', 'comments']}
      )(req,res);
      break;
    default:
      console.log('Not Supported');
  }
});

router.get('/callback/:provider', function(req, res){
  console.log('provider is', req.params.provider);
  passport.authenticate(req.params.provider, function(err, user, info){
    console.log('user is', user);
    if (err) throw err;
    if(user) {
      req.login(user, function(err){
        if(err) throw err;
        req.flash('success', 'You are now logged in with ' + req.params.provider);
        res.redirect('/');
      });
    } else {
      req.flash('danger', 'Something very bad happened!');
      res.redirect('/');
    }
  })(req, res);
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('info', 'You have been logged out.');
  res.redirect('/');
});

module.exports = router;