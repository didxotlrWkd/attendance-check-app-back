require('dotenv').config()
const jwt = require('jsonwebtoken');
const findUserById = require('../database/user/dao/user/findUserById');
const checkAccessTokenBlackList = require('../database/jwt/dao/accessTokenBlackList.js/checkAccessTokenBlackList');

module.exports = async (req, res, next) => {
    try {
        // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
        
        const token = jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET);
        if(token.type !== 'access_token') {
            return res.status(401).json({
                code: 401,
                message: '해당 토큰은 올바르지 않은 토큰입니다.'
            });
        }
        const is_blacklist_access_token = await checkAccessTokenBlackList(req.headers.authorization)

        if(is_blacklist_access_token) {
            return res.status(412).json({
                code : 412,
                message : '다른 디바이스에서 로그인 되었습니다.'
            })
        }

        const user = await findUserById(token.user_id)
        if(!user){
            return res.status(409).json({
                code: 409,
                message: '학생이 삭제되었습니다.'
            });
        }
        req.decoded = token
        return next();
    }
    // 인증 실패
    catch (error) {
        // 유효시간이 초과된 경우
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }
        // 토큰의 비밀키가 일치하지 않는 경우
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: 401,
                message: '유효하지 않은 토큰입니다.'
            });
        }
    }
}