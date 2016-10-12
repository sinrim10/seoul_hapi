'use strict';

var mongoose = require('mongoose');
var Feed = mongoose.model('Feeds');
var User = mongoose.model('Users');
var utils = require('../../config/utils');
var logger = require('mm-node-logger')(module);


/**
 * @api {post} /feeds 2.소식 쓰기
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/feeds
 * @apiVersion 0.1.0
 * @apiName Feed create
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {String} sido 시도
 * @apiParam {String} sigungu 시군구
 * @apiParam {Number} sigungu_code 시군구 코드
 * @apiParam {Number} latitude 위도
 * @apiParam {Number} longitude 경도
 * @apiParam {String} contents 내용
 * @apiParam {File[]} image 사진
 * @apiUse MySuccessPost
 * @apiUse MyError
 */
function create(req,res,next){
    var files = req.files;
    var params = req.body;
    var image = [];
    if(utils.isEmpty(params)){
        return res.status(400).json({success:false});
    }

    if(!utils.isEmpty(files)){
        if (!utils.isEmpty(files.image)) {
            for (var i =0 ;i< files.image.length;i++) {
                if(files.image[i].location != null){
                    image.push(files.image[i].location);
                }
            }
            params.photo = image;
        }
    }
    params.loc = { type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] };
    params.user = req.user._id;
    Feed.create(params)
        .then(function(result){
            return res.status(200).json({success:true});
        })
        .catch(function(err){
            logger.error('err ' , JSON.stringify(err,null,2));
            return next(err);
        })
}
function checkById(req,res,next){
    req.checkParams('id', '숫자만 가능').isInt();
    var errors = req.validationErrors();
    console.log('errors ', errors);
    if (errors) {
        return res.status(400).json({err: errors})
    }else{
        next();
    }
}

function checkFindAll(req,res,next){
    req.checkParams('lat', '숫자만 가능').isInt();
    req.checkParams('lon', '숫자만 가능').isInt();
    req.checkParams('lastindex', '숫자만 가능').isInt();
    var errors = req.validationErrors();
    console.log('errors ', errors);
    if (errors) {
        return res.status(400).json({err: errors})
    }else{
        next();
    }
}
/**
 * @api {get} /feeds/:lon/:lat/:lastindex?fields=loc,user,photo,contents,sido,sigungu,sigungu_code 1.전체조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/feeds/127/33/0?fields=loc,user,photo,contents,sido,sigungu,sigungu_code
 * @apiVersion 0.1.0
 * @apiName Feed findAll
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {Number} lon 현재위치의 경도
 * @apiParam {Number} lat 현재위치의 위도
 * @apiParam {Number} lastindex 마지막 인덱스 조회값
 * @apiUse FeedResult
 * @apiUse getOptions
 * @apiUse MySuccessArray
 * @apiUse MyError
 */
function findAll(req,res,next){
    var limit = {};
    var fields = '';
    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lon);
    var lastindex = parseInt(req.params.lastindex);
    var project = {_id:1};

    if(!utils.isEmpty(req.fields)){
        var array = req.fields.split(" ");
        array.forEach(function(key){
            project[key] = 1
        });
        project.distance = 1;
    }
    Feed.aggregate([
        {
            $geoNear:{
                near:[lon,lat],
                distanceField:"distance",
                spherical:true,
                distanceMultiplier:6378.139266
            }
        },{
            $match:req.filter
        },{
            $skip:lastindex
        },{
            $limit:5
        },{
            $project:project
        }
    ]).then(function(r){
        if(!utils.isEmpty(r)){
            User.populate(r,{path:'user',select:'name email avatar'})
                .then(function(r){
                    if(!utils.isEmpty(r)){
                        return res.status(200).json({result:r});
                    }else{
                        return res.status(404).json({err: "데이터가 없습니다."});
                    }
                }).catch(function(e){
                    return next(e);
            })
        }else{
            return res.status(404).json({err: "데이터가 없습니다."});
        }
    }).catch(function(e){
        next(e);
    })
}

/**
 * @api {get} /feeds/:id?fields=loc,user,photo,contents,sido,sigungu,sigungu_code 3.상세조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/feeds/0?fields=loc,user,sort,photo,title,contents,sido,sigungu,sigungu_code
 * @apiVersion 0.1.0
 * @apiName Feed findById
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {Number} id 물건 _id
 * @apiSuccess {Object} user 사용자 정보
 * @apiSuccess {String} sido 시도
 * @apiSuccess {String} sigungu 시군구
 * @apiSuccess {Number} sigungu_code 시군구 코드
 * @apiSuccess {Object} loc 좌표정보
 * @apiSuccess {String} loc.type 좌표 타입
 * @apiSuccess {Number} loc.coordinates[0] longitude
 * @apiSuccess {Number} loc.coordinates[1] latitude
 * @apiSuccess {String} contents 내용
 * @apiSuccess {String[]} photo 사진
 * @apiUse getOptions
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findById(req,res,next){
    Feed.findById(req.params.id)
        .select(req.fields)
        .then(function(r){
            if(!utils.isEmpty(r)){
                User.populate(r,{path:'user',select:'name email avatar'})
                    .then(function(r){
                        if(!utils.isEmpty(r)){
                            return res.status(200).json({result:r});
                        }else{
                            return res.status(404).json({err: "데이터가 없습니다."});
                        }
                    }).catch(function(e){
                    return next(e);
                })
            }else{
                return res.status(404).json({success:true,err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            logger.error('err ' , JSON.stringify(err,null,2));
            next(err);
        })
}

/**
 * @api {put} /feeds/:id 4.소식 수정
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/feeds/0
 * @apiVersion 0.1.0
 * @apiName Feed findOneAndUpdate
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {Number} id 소식 _id
 * @apiParam {Number} user 사용자 _id
 * @apiParam {String} contents 내용
 * @apiParam {String[]} photo 사진
 * @apiUse MySuccessPost
 * @apiUse MyError
 */
function findOneAndUpdate(req,res,next){
    var options = {_id:req.params.id};
    var files = req.files;
    var params = req.body;
    if(utils.isEmpty(params)){
        return res.status(400).json({success:false});
    }
    if(params.user != req.user._id){
        return res.status(401).json({success:false});
    }

    if(!utils.isEmpty(files)){
        if (!utils.isEmpty(files.image)) {
            for (var i =0 ;i< files.image.length;i++) {
                if(files.image[i].location != null){
                    image.push(files.image[i].location);
                }
            }
            params.photo = image;
        }
    }

    Feed.findOneAndUpdate(options,{$set:params},{new:true})
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.status(200).json({success:true});
            }else{
                return res.status(404).json({err: "데이터가 없습니다."})
            }
        })
        .catch(function(err){
            logger.error('err ' , JSON.stringify(err,null,2));
            next(err);
        })
}

/**
 * @api {delete} /feeds/:id 5.소식 삭제
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/feeds/0
 * @apiVersion 0.1.0
 * @apiName Feed findOneAndRemove
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {Number} id 소식 _id
 * @apiParam {Number} user 사용자 _id
 * @apiUse MySuccessPost
 * @apiUse MyError
 */
function findOneAndRemove(req,res,next){
    var options = {_id:req.params.id};
    var params = req.body;
    if(utils.isEmpty(params)){
        return res.status(400).json({success:false});
    }
    if(params.user != req.user._id){
        return res.status(401).json({success:false});
    }
    Feed.findOneAndRemove(options)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.status(200).json({success:true});
            }else{
                return res.status(404).json({err: "데이터가 없습니다."})
            }
        })
        .catch(function(err){
            logger.error('err ' , JSON.stringify(err,null,2));
            next(err);
        })
}

function findByUser(req,res,next){
    var limit = {};
    var fields = '';
    if(parseInt(req.params.id) != req.user._id){
        return res.status(401).json({success:false});
    }
    if(!utils.isEmpty(req.query.fields)){
        fields = req.query.fields.replace(/,/gi," ");
    }
    if(!utils.isEmpty(req.query.skip)){
        limit['skip'] = parseInt(req.query.skip);
    }
    if(!utils.isEmpty(req.query.limit)){
        limit['limit'] = parseInt(req.query.limit);
    }
    Feed.find({user:req.user._id},fields,limit)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.status(200).json({success:true,result:result});
            }else{
                return res.status(404).json({success:true,err: "데이터가 없습니다."});
            }
        })
        .catch(function(err){
            logger.error('err ' , JSON.stringify(err,null,2));
            next(err);
        })
}

module.exports = {
    create : create,
    findAll: findAll,
    findById : findById,
    findOneAndUpdate : findOneAndUpdate,
    findOneAndRemove : findOneAndRemove,
    findByUser : findByUser,
    checkFindAll:checkFindAll,
    checkById:checkById
};
