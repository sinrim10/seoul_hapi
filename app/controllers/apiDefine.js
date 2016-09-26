/**
 * @apiDefine MySuccess
 * @apiSuccess {Object} result 결과
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "result": {Object}
 * }
 */

/**
 * @apiDefine MySuccessArray
 * @apiSuccess {Object[]} result 결과
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "result": [{Object}]
 * }
 */

/**
 * @apiDefine UserResult
 * @apiSuccess {String} name 이름
 * @apiSuccess {String} email 이메일주소
 * @apiSuccess {String} avatar 프로필 사진
 * @apiSuccess {String} provider 인증 모듈
 * @apiSuccess {Object} facebook 페이스북 정보
 */


/**
* @apiDefine BasicSuccess
* @apiSuccess {Number} _id primary key 값
* @apiSuccess {Date} updated 수정일
* @apiSuccess {Date} created 생성일
*/

/**
 * @apiDefine getOptions
 * @apiParam {String} fields 선택할 필드값 (,) 콤마 구분
 * @apiParam {Object} filter 검색 조건 JSON 데이터 형태
 */




/**
 * @apiDefine MyError
 * @apiError (Error 400 파라미터 누락) err 에러내용
 * @apiErrorExample 파라미터 누락
 *     HTTP/1.1 400 파라미터 누락
 *     {
 *       "err": "에러메세지"
 *     }
 *
 * @apiError (Error 401 권한 실패) err 에러내용
 * @apiErrorExample 권한 실패
 *     HTTP/1.1 401 로그인 권한 실패
 *     {
 *       "err": "에러메세지"
 *     }
 *

 * @apiError (Error 404 Not Found) err 에러내용
 * @apiErrorExample Not Found
 *     HTTP/1.1 404 Not Found
 *     {
 *       "err": "데이터가 없습니다."
 *     }
 * @apiError (Error 500 서버에러) err 에러내용
 * @apiErrorExample Internal Server Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "err": "에러메세지"
 *     }
 *

 */

/**
 * @apiDefine MyHeader
 * @apiHeader {String} Authorization auth jwt token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Olleego token"
 *     }
 */
