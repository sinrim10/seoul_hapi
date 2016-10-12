/**
 * Created by lsk on 2016-10-08.
 */

'use strict';

var mongoose = require('mongoose');
var Product = mongoose.model('Products');
var Share = mongoose.model('Share');
var User = mongoose.model('Users');
var utils = require('../../config/utils');
var logger = require('mm-node-logger')(module);
var async = require('async');

/**
 * @api {post} /share 2.요청하기
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/share
 * @apiVersion 0.1.0
 * @apiName Share create
 * @apiGroup Share
 * @apiPermission user
 * @apiParam {Number} product 물건 _id
 * @apiUse MySuccessPost
 * @apiUse MyError
 * @apiUse ShareError
 */
function create(req, res, next) {
    var body = req.body;
    Product.findById(body.product)
        .then(function (r) {
            if (!utils.isEmpty(r)) {
                if (req.user._id == r.user) {
                    return res.status(401).json({err: "본인의 물품은 요청 할 수 없습니다."});
                }
                body.renter = req.user._id;
                body.lister = r.user;
                body.sort = r.sort;
                Share.create(body)
                    .then(function (r) {
                        return res.status(200).json({success:true});
                    })
                    .catch(function (e) {
                        return next(e);
                    })
            } else {
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function (e) {
            return next(e);
        })

}
function checkCreate(req, res, next) {
    req.checkBody('product', '필수입력').notEmpty();
    req.checkBody('product', '숫자만 가능').isInt();
    var errors = req.validationErrors();
    console.log('errors ', errors);
    if (errors) {
        return res.status(400).json({err: errors})
    } else {
        next();
    }
}

/**
 * @api {get} /share?fields=title,photo,contents,loc 1.공유한 물건 조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/share?fields=title,photo,contents
 * @apiVersion 0.1.0
 * @apiName Share findByShare
 * @apiGroup Share
 * @apiPermission user
 * @apiUse ProductResult
 * @apiSuccess {Number} count 현재 요청받은 갯수
 * @apiUse getOptions
 * @apiUse MySuccessArray
 * @apiUse MyError
 */
function findByShare(req, res, next) {
    var project = {_id: 1};
    if (!utils.isEmpty(req.fields)) {
        var array = req.fields.split(" ");
        array.forEach(function (key) {
            project[key] = 1
        });
        project.distance = 1;
    }
    var user = req.user._id;
    //var user = 3;
    Product.aggregate([
        {
            $match: {
                user: user
            }
        }, {
            $project: project
        }
    ]).then(function (r) {
        if (!utils.isEmpty(r)) {
            async.eachSeries(r, function (n, callback) {
                Share.aggregate([
                    {
                        $match: {
                            lister: user,
                            product: n._id,
                            status: 'RR'
                        }
                    }, {
                        $group: {
                            _id: '$product',
                            count: {$sum: 1}
                        }
                    }
                ]).then(function (r) {
                    if (utils.isEmpty(r)) {
                        n.count = 0;
                    } else {
                        n.count = r[0].count;
                    }
                    callback();
                }).catch(function (e) {
                    return next(e);
                })
            }, function done(err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({result: r})
            });
        } else {
            return res.status(404).json({err: "데이터가 없습니다."});
        }
    }).catch(function (e) {
        return next(e);
    })
}

/**
 * @api {get} /share/product/:product_id?fields=title,photo,contents,loc 3.공유한 물건 상세
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/share/product/3?fields=title,photo,contents,user
 * @apiVersion 0.1.0
 * @apiName Share findByIdShare
 * @apiGroup Share
 * @apiPermission user
 * @apiUse ProductResult
 * @apiSuccess {Object} lister 빌려주는사람
 * @apiSuccess {Object[]} share 공유 정보
 * @apiSuccess {Number} share._id 공유 _id
 * @apiSuccess {String} share.status 공유 상태  (RR 대기 , RC 취소 , RS 승인)
 * @apiSuccess {Date} share.startAt 요청 시작일
 * @apiSuccess {Object} share.renter 빌리는사람
 * @apiUse getOptions
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findByIdShare(req, res, next) {
    var user = req.user._id;
    //var user = 3;
    var product = parseInt(req.params.product_id);
    Share.aggregate([
        {
            $match: {
                lister: user,
                product: product,
                status: 'RR'
            }
        }, {
            $group: {
                _id: '$product',
                lister: {$first: '$lister'},
                share: {
                    $push: {
                        _id: '$_id',
                        status: '$status',
                        startAt: '$startAt',
                        renter: '$renter'
                    }
                }
            }
        }
    ]).then(function (r) {
        if (!utils.isEmpty(r)) {
            Product.populate(r, {path: '_id', select: req.fields})
                .then(function (r) {
                    if (!utils.isEmpty(r)) {
                        User.populate(r, {path: 'share.renter lister', select: 'email name avatar'})
                            .then(function (r) {
                                if (!utils.isEmpty(r)) {
                                    return res.status(200).json({result: r[0]})
                                } else {
                                    return res.status(404).json({err: "데이터가 없습니다."});
                                }
                            })
                            .catch(function (e) {
                                return next(e);
                            });
                    } else {
                        return res.status(404).json({err: "데이터가 없습니다."});
                    }
                })
                .catch(function (e) {
                    return next(e);
                });
        } else {
            return res.status(404).json({err: "데이터가 없습니다."});
        }
    }).catch(function (e) {
        return next(e);
    })
}

/**
 * @api {get} /share/product/request?fields=title,photo,contents,loc 6.요청한 물건 조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/share/product/request?fields=title,photo,contents,loc
 * @apiVersion 0.1.0
 * @apiName Share findByIdShareReq
 * @apiGroup Share
 * @apiPermission user
 * @apiUse ShareResult
 * @apiUse getOptions
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findByIdShareReq(req,res,next){
    var user = req.user._id;
    Share.find({renter:user,status:'RR'})
        .populate('product',req.fields)
        .populate('renter','name email avatar')
        .populate('lister','name email avatar')
        .then(function (r) {
            if (!utils.isEmpty(r)) {
                return res.status(200).json({result: r})
            } else {
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function (e) {
            return next(e);
        });
}

/**
 * @api {get} /share/product/request/count 7.요청한 물건 갯수
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/share/product/request?fields=title,photo,contents,loc
 * @apiVersion 0.1.0
 * @apiName Share findByIdShareReqCount
 * @apiGroup Share
 * @apiPermission user
 * @apiUse getOptions
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findByIdShareReqCount(req,res,next){
    var user = req.user._id;
    Share.count({renter:user,status:'RR'})
        .then(function (r) {
            if (!utils.isEmpty(r)) {
                return res.status(200).json({result: r})
            } else {
                return res.status(404).json({err: "데이터가 없습니다."});
            }
        })
        .catch(function (e) {
            return next(e);
        });
}
/**
 * @api {put} /share/:id 4.요청 상태 변경
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/share/2
 * @apiVersion 0.1.0
 * @apiName Share findByIdChangeStatus
 * @apiGroup Share
 * @apiPermission user
 * @apiParam {Number} id 공유 _id
 * @apiParam {String} status 상태
 * @apiUse MySuccessPost
 * @apiUse MyError
 */
function findByIdChangeStatus(req, res, next) {
    var body = req.body;
    if (['RS', 'RC','RR'].indexOf(body.status) == -1) {
        return res.status(400).json({err: 'status 는 RS,RC,RR 만 입력 할 수 있습니다.'})
    }
    var user = req.user._id;
    //var user = 3;
    Share.findById(req.params.id)
        .then(function (r) {
            if (r.lister != user) {
                return res.status(401).json({err: '본인 물건만 상태 변경 가능합니다.'});
            }
            r.status = body.status;
            r.save()
                .then(function (r) {
                    return res.status(200).json({success:true});
                }).catch(function (e) {
                    return next(e);
                })
        }).catch(function (e) {
            return next(e);
        })
}

/**
 * @api {get} /mypage 1.마이 페이지 정보
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/mypage
 * @apiVersion 0.1.0
 * @apiName Mypage findMyPage
 * @apiGroup Mypage
 * @apiPermission user
 * @apiSuccess {Number} rq1 공유함
 * @apiSuccess {Number} rs1 공유받음
 * @apiSuccess {Number} rq2 요청한 물건
 * @apiSuccess {Number} rs2 공유한 물건
 * @apiSuccess {Object} user 사용자 정보
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findMyPage(req,res,next){
    var user = req.user._id;
    async.series({
        rq1 :function(cb){
            Product.count({user:user})
                .then(function(r){
                    cb(null,r);
                }).catch(function(e){
                    cb(e,null);
                })
        },
        rs1:function(cb){
            Share.count({renter:user,status:'RS'})
                .then(function(r){
                    cb(null,r);
                }).catch(function(e){
                    cb(e,null);
                })
        },
        rq2:function(cb){
            Share.count({renter:user,status:'RR'})
                .then(function(r){
                    cb(null,r);
                }).catch(function(e){
                    cb(e,null);
                })
        },
        rs2:function(cb){
            Share.count({lister:user,status:'RR'})
                .then(function(r){
                    cb(null,r);
                }).catch(function(e){
                    cb(e,null);
                })
        },
        user:function(cb){
            User.findById(user)
                .select('name email avatar')
                .then(function(r){
                    cb(null,r);
                }).catch(function(e){
                    cb(e,null);
                })
        }
    },function done(e,r){
        if(e){
            return next(e);
        }
        return res.status(200).json({result:r});
    })
}



function checkByIdStatus(req, res, next) {
    req.checkParams('id', '숫자만 가능').isInt();
    req.checkBody('status', '필수사항').notEmpty();
    var errors = req.validationErrors();
    console.log('errors ', errors);
    if (errors) {
        return res.status(400).json({err: errors})
    } else {
        next();
    }
}
module.exports = {
    create: create,
    checkCreate: checkCreate,
    checkByIdStatus: checkByIdStatus,
    findByShare: findByShare,
    findByIdShare: findByIdShare,
    findByIdChangeStatus: findByIdChangeStatus,
    findByIdShareReq:findByIdShareReq,
    findByIdShareReqCount:findByIdShareReqCount,
    findMyPage:findMyPage

};