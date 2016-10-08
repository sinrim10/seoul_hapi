
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
/*var FacebookStrategy = require('passport-facebook').Strategy;*/
var FacebookTokenStrategy = require('passport-facebook-token');
var User = mongoose.model('Users');
var config = require('../config');
var utils = require('../utils');

/**
 * Expose
 */

module.exports.Strategy = new FacebookTokenStrategy({
      profileFields: ['id', 'displayName', 'photos', 'emails','link','name'],
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    var options = {
      criteria: { 'facebook.id': profile.id,'provider':'facebook' }
    };
      User.findOne(options.criteria)
          .then(function(r){
              if (utils.isEmpty(r)) {
                  User.create({
                      name: profile.displayName,
                      email: profile.emails[0].value,
                      avatar:profile.photos[0].value,
                      provider: profile.provider,
                      facebook: profile
                  }).then(function(r){
                          return done(null, r);
                  }).catch(function(e){
                      console.log('e ' ,e);
                      return res.sendStatus(400);
                  });
              } else {
                  return done(null, r);
              }
          }).catch(function(e){
              console.log('e ' ,e);
            return done(e,null);
      })
  }
);
