/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var KakaoStrategy = require('passport-kakao-token').Strategy;
var User = mongoose.model('Users');
var config = require('../config');
var utils = require('../utils');

/**
 * Expose
 */

module.exports.Strategy = new KakaoStrategy({
        clientID: "edd240f1cd38329f15e040a2e38bb510"
    }, function (accessToken, refreshToken, profile, done) {
        var options = {
            criteria: {'kakao.id': profile.id, 'provider': 'kakao'}
        };
        User.findOne(options.criteria)
            .then(function (r) {
                if (utils.isEmpty(r)) {
                    User.create({
                        name: profile.username,
                        email: profile.id+"@kakao.com",
                        avatar: profile._json.properties.profile_image,
                        provider: profile.provider,
                        kakao: profile._json
                    }).then(function (r) {
                        return done(null, r);
                    }).catch(function (e) {
                        console.log('e ', e);
                        return res.sendStatus(400);
                    });
                } else {
                    return done(null, r);
                }
            }).catch(function (e) {
            console.log('e ', e);
            return done(e, null);
        });
    }
)