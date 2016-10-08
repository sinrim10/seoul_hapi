var mongoose = require('mongoose');
var Product = mongoose.model('Products');
var User = mongoose.model('Users');
var utils = require('../../config/utils');
var logger = require('mm-node-logger')(module);


/**
 * @api {post} /products 2.물건 공유하기
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/products
 * @apiVersion 0.1.0
 * @apiName Product create
 * @apiGroup Product
 * @apiPermission user
 * @apiParam {Number} latitude 위도
 * @apiParam {Number} longitude 경도
 * @apiParam {String} sido 시도
 * @apiParam {String} sigungu 시군구
 * @apiParam {Number} sigungu_code 시군구 코드
 * @apiParam {String} sort 종류 (SH : 나눔 , SR : 대여)
 * @apiParam {String} category 카테고리
 * @apiParam {String} title 제목
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
        return res.sendStatus(400);
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
    if(['SH','SR'].indexOf(params.sort) == -1){
        return res.status(400).json({err:'종류는 SH 또는 SR 만 입력 가능합니다.'});
    }
    params.loc = { type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] };
    params.user = req.user._id;
    Product.create(params)
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
 * @api {get} /products/:lon/:lat/:lastindex?fields=loc,user,sort,photo,title,contents 1.전체조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/products/127/33/0?fields=loc,user,sort,photo,title,contents
 * @apiVersion 0.1.0
 * @apiName Product findAll
 * @apiGroup Product
 * @apiPermission user
 * @apiParam {Number} lon 현재위치의 경도
 * @apiParam {Number} lat 현재위치의 위도
 * @apiParam {Number} lastindex 마지막 인덱스 조회값
 * @apiUse ProductResult
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
    if(!utils.isEmpty(req.query.skip)){
        limit['skip'] = parseInt(req.query.skip);
    }
    if(!utils.isEmpty(req.query.limit)){
        limit['limit'] = parseInt(req.query.limit);
    }
    if(!utils.isEmpty(req.fields)){
        var array = req.fields.split(" ");
        array.forEach(function(key){
            project[key] = 1
        });
        project.distance = 1;
    }
    Product.aggregate([
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
 * @api {get} /products/:id?fields=loc,user,sort,photo,title,contents 3.상세조회
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/products/0?fields=loc,user,sort,photo,title,contents
 * @apiVersion 0.1.0
 * @apiName Product findById
 * @apiGroup Product
 * @apiPermission user
 * @apiParam {Number} id 물건 _id
 * @apiSuccess {Object} user 사용자 정보
 * @apiParam {String} sido 시도
 * @apiParam {String} sigungu 시군구
 * @apiParam {Number} sigungu_code 시군구 코드
 * @apiSuccess {Object} loc 좌표정보
 * @apiSuccess {String} loc.type 좌표 타입
 * @apiSuccess {Number} loc.coordinates[0] longitude
 * @apiSuccess {Number} loc.coordinates[1] latitude
 * @apiSuccess {String} sort 종류 (SH : 나눔 , SR : 대여)
 * @apiSuccess {String} title 제목
 * @apiSuccess {String} contents 내용
 * @apiSuccess {String} category 카테고리
 * @apiSuccess {String[]} photo 사진
 * @apiUse getOptions
 * @apiUse MySuccess
 * @apiUse MyError
 */
function findById(req,res,next){
    Product.findById(req.params.id)
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
 * @api {put} /products/:id 4.물건 수정
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/products/0
 * @apiVersion 0.1.0
 * @apiName Product findOneAndUpdate
 * @apiGroup Product
 * @apiPermission user
 * @apiParam {Number} id 물건 _id
 * @apiParam {Number} user 사용자 _id
 * @apiParam {String} sort 종류 (SH : 나눔 , SR : 대여)
 * @apiParam {String} title 제목
 * @apiParam {String} contents 내용
 * @apiParam {String} category 카테고리
 * @apiParam {String[]} photo 사진
 * @apiUse MySuccessPost
 * @apiUse MyError
 */
function findOneAndUpdate(req,res,next){
    var options = {_id:req.params.id};
    var files = req.files;
    var params = req.body;
    if(utils.isEmpty(params)){
        return res.sendStatus(400);
    }
    if(params.user != req.user._id){
        return res.sendStatus(401);
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

    Product.findOneAndUpdate(options,{$set:params},{new:true})
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.sendStatus(200);
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
 * @api {delete} /products/:id 5.물건 삭제
 * @apiExample Example usage:
 * curl -i http://olleego1.iptime.org:7000/products/0
 * @apiVersion 0.1.0
 * @apiName Product findOneAndRemove
 * @apiGroup Product
 * @apiPermission user
 * @apiParam {Number} id 물건 _id
 * @apiParam {Number} user 사용자 _id
 * @apiUse MySuccessPost
 * @apiUse MyError
 */
function findOneAndRemove(req,res,next){
    var options = {_id:req.params.id};
    var params = req.body;
    if(utils.isEmpty(params)){
        return res.sendStatus(400);
    }
    if(params.user != req.user._id){
        return res.sendStatus(401);
    }
    Product.findOneAndRemove(options)
        .then(function(result){
            if(!utils.isEmpty(result)){
                return res.sendStatus(200);
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
        return res.sendStatus(401);
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
    Product.find({user:req.user._id},fields,limit)
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
}
