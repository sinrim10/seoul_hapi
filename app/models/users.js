/**
 * Created by Administrator on 2015-10-27.
 */
'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var oAuthTypes = [
    'facebook','kakao'
];
var autoIncrement = require('mongoose-auto-increment');
var UsersSchema = new Schema({
    name: { type: String, default: '', required: true},//이름
    email: { type: String, default: '', required: true, unique: true,validate :  validators.isEmail() },//이메일
    avatar:{type:String},
    provider: { type: String, default: '' }, //auth 제공 Strategy
    hashed_password: { type: String, default: '' }, //해쉬비밀번호
    salt: { type: String, default: '' },//salt키
    authToken: { type: String, default: '' },//인증토큰
    facebook: {},//페이스북 인증정보
    kakao: {},//카카오톡 인증정보
    token : {type: String},
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: { createdAt: 'created',updatedAt: 'updated'} });
UsersSchema.plugin(autoIncrement.plugin, {
    model: 'Users'
});



/**
 * Virtuals/home/ubuntu/Bikee/app/controllers/users.js:34:47
 */

UsersSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

UsersSchema.path('name').validate(function (name) {
    if (this.skipValidation()) return true;
    return name.length;
}, '이름을 입력하지 않았습니다.');
UsersSchema.path('email').validate(function (email) {
    if (this.skipValidation()) return true;
    return email.length;
}, '이메일을 입력하지 않았습니다.');

UsersSchema.path('email').validate(function (email, fn) {
    var User = mongoose.model('Users');
    if (this.skipValidation()) fn(true);

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, '가입된 이메일 입니다.');

/*UsersSchema.path('hashed_password').validate(function (hashed_password) {
    if (this.skipValidation()) return true;
    return hashed_password.length && this._password.length;
}, '패스워드를 입력하지 않았습니다.');*/


/**
 * Pre-save hook
 */

UsersSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.skipValidation()) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
})

/**
 * Methods
 */

UsersSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    /**
     * Validation is not required if using OAuth
     */

    skipValidation: function() {
        return ~oAuthTypes.indexOf(this.provider);
    }

};

/**
 * Statics
 */

UsersSchema.statics = {

    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) { //options == 조건절 의미.
        this.findOne(options.criteria)
            .select(options.select)//보여줄려는 컬럼 선택
            .exec(cb);
    }
}


module.exports = mongoose.model('Users', UsersSchema);