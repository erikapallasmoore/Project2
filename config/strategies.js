var LocalStrategy = require('passport-local').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var db = require('../models');

module.exports = {
  localStrategy: new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      db.user.find({where: {email: email}}).then(function(user) {
        if (user) {
          user.checkPassword(password, function(err, result) {
            if (err) return done(err);
            if (result) {
              done(null, user.get());
            } else {
              done(null, false, {message: 'Invalid password'});
            }
          });
        } else {
          done(null, false, {message: 'Unknown user'});
        }
      });
    }
  ),
  instagramStrategy: new InstagramStrategy({
      clientID: process.env.INSTAGRAM_APP_ID,
      clientSecret: process.env.INSTAGRAM_APP_SECRET,
      callbackURL: process.env.BASE_URL + '/auth/callback/instagram/'
    },
    function(accessToken, refreshToken, profile, done) {
      db.provider.find({
        where: {
          pid: profile.id,
          type: profile.provider
        },
        include: [db.userinfo]
      }).then(function(provider) {
        if (provider && provider.user) {
          provider.token = accessToken;
          provider.save().then(function() {
            console.log('here', provider.user.get());
            done(null, provider.user.get());
          });
        } else {
          var user = profile.username;
          db.userinfo.findOrCreate({
            where: {user: user}
          }).spread(function(user, created) {
            if (created) {
              user.createProvider({
                pid: profile.id,
                token: accessToken,
                type: profile.provider
              }).then(function() {
                console.log('there', user.get());
                done(null, user.get());
              })
            } else {
              console.log('this');
              done(null, false, {message: 'You already signed up with this email address. Please login'});
            }
          });
        }
      });
    }
  ),
  serializeUser: function(user, done) {
    done(null, user.id);
  },
  deserializeUser: function(id, done) {
    db.userinfo.findById(id).then(function(user) {
      done(null, user.get());
    }).catch(done);
  }
}