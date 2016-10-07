var auth = require('./middlewares/authorization');
var mongoose = require('mongoose');
var utils = require('./utils');
var user = require('../app/controllers/user');
var product = require('../app/controllers/product');
var product_upload = require('../config/upload').upload({
    dirname:'products'
});
var productUpload = product_upload.fields([{ name: 'image', maxCount: 5 }]);
/**
 * Expose routes
 */

module.exports = function (app, passport) {
    app.all("*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', "POST, GET, DELETE, PUT,OPTIONS");
        res.header('Access-Control-Max-Age', 3600);
        res.header('Access-Control-Allow-Headers', "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization");
        next();
    });

    app.get('*', function (req, res, next) {
        var filter = {};
        var fields = "";
        try {
            if (!utils.isEmpty(req.query.filter)) {
                filter = JSON.parse(req.query.filter);
            }
            if (!utils.isEmpty(req.query.fields)) {
                fields = req.query.fields.replace(/,/gi, " ");
            }
        } catch (e) {
            return res.status(400).json({err: e.message})
        }
        if (typeof filter != 'object' || Array.isArray(filter) || typeof fields != 'string') {
            return res.status(400).json({err: "not json"})
        }
        console.log('fields ', fields);
        console.log('filter ', filter);
        req.fields = fields;
        req.filter = filter;
        next();
    });

    /*
     * 사용자 관련
     * */

    app.get('/users', user.findAll);
    app.get('/users/:id', auth.requiresLogin, user.findById);
    app.put('/users/:id', auth.user.hasAuthorization, user.findByIdAndUpdate);
    app.delete('/users/:id', auth.user.hasAuthorization, user.findByIdAndRemove);
    app.get('/profile', auth.requiresLogin, user.findByMe);
    app.post('/logout', auth.requiresLogin, user.logout);
    app.post('/auth/facebook/token', passport.authenticate('facebook-token'), user.facebook);

    /*
    * 물건 공유
    * */
    app.get('/products/:lon/:lat/:lastindex',auth.requiresLogin,product.checkFindAll,product.findAll);
    app.get('/products/:id',auth.requiresLogin,product.checkById,product.findById);
    app.post('/products',auth.requiresLogin,productUpload,product.create);
    app.put('/products/:id',auth.requiresLogin,product.checkById,productUpload,product.findOneAndUpdate);
    app.delete('/products/:id',auth.requiresLogin,product.checkById,product.findOneAndRemove);

    /*
     * 에러 핸들러
     * */
    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();//http://egloos.zum.com/opensea/v/5814426
        }
        console.log('err ', err);
        return res.status(500).json({err: err.message});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        console.log('req', req.session);
        res.status(404).json({
            url: req.originalUrl,
            err: 'Not found'
        });
    });
}