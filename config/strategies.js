var LocalStrategy = require('passport-local').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var db = require('../models');

module.exports = {
  localStrategy: new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      db.userinfo.find({where: {email: email}}).then(function(user) {
        if (user) {
          userinfo.checkPassword(password, function(err, result) {
            if (err) return done(err);
            if (result) {
              done(null, userinfo.get());
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
  instagramStrategy : new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_APP_ID,
      clientSecret: process.env.INSTAGRAM_APP_SECRET,
      callbackURL: process.env.BASE_URL + '/auth/callback/instagram/'
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('my Profile',profile);
      db.provider.find({
        where: {
          pid: profile.id,
          type: profile.provider
        },
        include: [db.userinfo]
      }).then(function(provider) {
        console.log('provider is ', provider);
        if (provider && provider.userinfo) {
          provider.token = accessToken;
          provider.save().then(function() {
            done(null, provider.userinfo.get());
          });
        } else {
          console.log('no provider');
          var user = profile.username;
          var name = profile.displayName.replace('\\','');
          db.userinfo.findOrCreate({
            where: {user: user},
            defaults: {name: name}
          }).spread(function(userinfo, created) {
            console.log(userinfo, created);
            if (created) {
              userinfo.createProvider({
                pid: profile.id,
                token: accessToken,
                type: profile.provider
              }).then(function() {
                done(null, userinfo.get());
              })
            } else {
              done(null, false, {message: 'You already signed up with this Instagram account. Please login'});
            }
          });
        }
      });
    }
  ),
  serializeUser: function(userinfo, done) {
    done(null, userinfo.id);
  },
  deserializeUser: function(id, done) {
    db.userinfo.findById(id).then(function(userinfo) {
      done(null, userinfo.get());
    }).catch(done);
  }
}