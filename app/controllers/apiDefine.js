'use strict';
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
 * @apiDefine MySuccessPost
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
 * @apiDefine ProductResult
 * @apiSuccess {Object} user 사용자 정보
 * @apiSuccess {Object} loc 좌표정보
 * @apiSuccess {String} loc.type 좌표 타입
 * @apiSuccess {Number} loc.coordinates[0] longitude
 * @apiSuccess {Number} loc.coordinates[1] latitude
 * @apiSuccess {String} sido 시도
 * @apiSuccess {String} sigungu 시군구
 * @apiSuccess {Number} sigungu_code 시군구 코드
 * @apiSuccess {Number} distance 현재 위치로 부터의 거리 (단위: km)
 * @apiSuccess {String} sort 종류 (SH : 나눔 , SR : 대여)
 * @apiSuccess {String} category 카테고리
 * @apiSuccess {String} title 제목
 * @apiSuccess {String} contents 내용
 * @apiSuccess {String[]} photo 사진
 */

/**
 * @apiDefine FeedResult
 * @apiSuccess {Object} user 사용자 정보
 * @apiSuccess {Object} loc 좌표정보
 * @apiSuccess {String} loc.type 좌표 타입
 * @apiSuccess {Number} loc.coordinates[0] longitude
 * @apiSuccess {Number} loc.coordinates[1] latitude
 * @apiParam {String} sido 시도
 * @apiParam {String} sigungu 시군구
 * @apiParam {Number} sigungu_code 시군구 코드
 * @apiSuccess {Number} distance 현재 위치로 부터의 거리 (단위: km)
 * @apiSuccess {String} contents 내용
 * @apiSuccess {String[]} photo 사진
 */

/**
 * @apiDefine ShareResult
 * @apiSuccess {Object} lister 빌려주는사람
 * @apiSuccess {Object} renter 빌리는사람
 * @apiSuccess {Object} product 빌리는물건정보
 * @apiSuccess {String} sort 빌리는 종류
 * @apiSuccess {String} status 요청 상태 (RR 대기 , RC 취소 , RS 승인)
 * @apiSuccess {Date} startAt 요청 시작일
 * @apiSuccess {Date} endtAt 요청 종료일
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
 * @apiDefine ShareError
 * @apiError (Error 401 요청 권한 실패) err 에러내용
 * @apiErrorExample 요청 권한 실패
 *     HTTP/1.1 401 요청 권한 실패
 *     {
 *          "err": "본인의 물품은 요청 할 수 없습니다."
 *      }
 */

