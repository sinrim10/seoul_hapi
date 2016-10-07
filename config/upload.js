/**
 * Created by Administrator on 2016-04-27.
 */
var multer = require('multer');
var multerS3 = require('multer-s3');
var config = require('./config');
var path = require('path');

var upload = function(options){
    var AWS = require('aws-sdk');
    AWS.config.region = config.s3.region;
    AWS.config.accessKeyId = config.s3.accessKeyId;
    AWS.config.secretAccessKey = config.s3.secretAccessKey;
    var s3 = new AWS.S3();
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: 'sbikee',
            acl: 'public-read',
            metadata: function (req, file, cb) {
                cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
                var name = Date.now().toString() + path.extname(file.originalname);
                cb(null,options.dirname+'/'+name);
            }
        })
    });
};

module.exports.upload = upload;
