var mongoose = require('mongoose');

/**
 *  로그인 라우팅 미들웨어
 */

exports.requiresLogin = function (req, res, next) {
  console.log('req ' ,req.session);
  if (req.isAuthenticated()) {
    return next()
  } else{
    return res.status(401).json({err:"로그인 권한 실패"});
  }
  /*if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')*/
}

/**
 *  사용자 관련 권한 체크
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    req.checkParams('id','not number').isInt();
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({err: errors})
    }
    var id = req.params.id;
    if (id != req.user.id) {
      return res.status(401).json({err:"본인 정보만 수정 가능합니다."});
    }else{
      return next();
    }
  }
};