/**
 * Created by lsk on 2016-09-26.
 */
'use strict';
var mongoose = require('mongoose');
var logger = require('mm-node-logger')(module);
var User = mongoose.model('Users');
var utils = require('../../config/utils');


/**
 * @api {get} /users 1.전체 조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/users?filter={"facebook.id":"1164951946912464"}&fields=email,name,facebook
 * @apiVersion 0.1.0
 * @apiName User findAll
 * @apiGroup User
 * @apiPermission admin
 * @apiUse UserResult
 * @apiUse getOptions
 * @apiUse MySuccessArray
 * @apiUse MyError
 */
function findAll(req, res, next) {
    console.log('req.filter ' ,req.filter);
    console.log('req.fields ' ,req.fields);
    User.find(req.filter)
        .select(req.fields)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.status(200).json({result:result});
            }else{
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            console.log('err ' , err);
            return next(err);
        })
}

/**
 * @api {get} /users/:id 2.단일 조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/users/0
 * @apiVersion 0.1.0
 * @apiName User findById
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} fields 선택할 필드값 (,) 콤마 구분
 * @apiUse UserResult
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findById(req, res, next) {
    req.checkParams('id','not number').isInt();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({err: errors})
    }
    User.findById(req.params.id)
        .select(req.fields)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.sendStatus(200).json({result:result});
            }else{
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            return next(err);
        })
}
/**
 * @api {put} /users/:id 3.회원수정
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/users/0
 * @apiVersion 0.1.0
 * @apiName User findByIdAndUpdate
 * @apiGroup User
 * @apiPermission user
 * @apiParamExample {json} Request-Example:
 * {
    "name" : "수정"
 * }
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findByIdAndUpdate(req, res, next) {
    req.checkParams('id','not number').isInt();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({err: errors})
    }
    User.findByIdAndUpdate(req.params.id,{$set:req.body})
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.sendStatus(200);
            }else{
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            next(err);
        })
}

/**
 * @api {delete} /users/:id 4.회원삭제
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/users/0
 * @apiVersion 0.1.0
 * @apiName User findByIdAndRemove
 * @apiGroup User
 * @apiPermission admin
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findByIdAndRemove(req, res, next){
    req.checkParams('id','not number').isInt();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({err: errors})
    }
    User.findByIdAndRemove(req.params.id)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.sendStatus(200);
            }else{
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            next(err);
        })
}

/**
 * @api {get} /profile 6.본인 정보 조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/profile
 * @apiVersion 0.1.0
 * @apiName User findByMe
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} fields 선택할 필드값 (,) 콤마 구분
 * @apiUse UserResult
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findByMe(req,res,next){
    User.findById(req.user.id)
        .select(req.fields)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.status(200).json({result:result});
            }else{
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            return next(err);
        })
}

/**
 * @api {post} /logout 7.로그아웃
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/logout
 * @apiVersion 0.1.0
 * @apiName User logout
 * @apiGroup User
 * @apiPermission user
 * @apiUse MySuccess
 * @apiUse MyError
 */
function logout(req,res,next){
    req.logout();
    res.sendStatus(200);
}


/**
 * @api {post} /auth/facebook/token 5.페이스북 로그인
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/auth/facebook/token
 * @apiVersion 0.1.0
 * @apiName User facebook
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * {
    "access_token" : EAACtZBG6I8BsBAIB8NnKT2vswAB3WP.....
 * }
 *
 * @apiParam {String} access_token 페이스북 토큰
 * @apiPermission user
 * @apiUse MySuccess
 * @apiUse MyError
 */
function facebook(req,res,next){
    req.login(req.user,function(err){
        if ( err ) {
            return res.status(401).json({err:'Session Write Error'});
        }
        res.sendStatus(200);
    })
}


module.exports = {
    findAll : findAll,
    findById : findById,
    findByIdAndUpdate:findByIdAndUpdate,
    findByIdAndRemove : findByIdAndRemove,
    findByMe : findByMe,
    logout : logout,
    facebook:facebook

};
