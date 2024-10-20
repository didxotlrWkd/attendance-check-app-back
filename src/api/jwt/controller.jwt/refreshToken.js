require("dotenv").config();
const checkRefreshToken = require('../service.jwt/checkRefreshToken')
const generateToken = require('../service.jwt/generateToken')
const checkRefreshBlackList = require('../service.jwt/checkRefreshBlackList')
const jwt = require('jsonwebtoken');

const findUserById = require('../../../database/user/dao/user/findUserById')


// access token을 refresh token 기반으로 재발급
module.exports = async (req, res, next) => {
    try{
        const refresh_token = req.headers.authorization
    
        const token = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        if(token.type !== 'refresh_token') {
            return res.status(420).json({
                code: 420,
                message: '해당 토큰은 옳바르지 않은 토큰입니다.'
            });
        }
        const is_refresh_blackList = await checkRefreshBlackList(refresh_token)
        if (is_refresh_blackList) return res.status(421).json({
            code: 421,
            message: '해당 토큰은 이미 삭제처리된 토큰입니다.'
        });

        const is_refresh_token = await checkRefreshToken(refresh_token, token.user_id)
        if (!is_refresh_token) return res.status(422).json({
            code: 422,
            message: '해당 토큰은 사용자와 일치하지 않는 토큰입니다.'
        });

        const user = await findUserById(token.user_id)
        if(!user) throw new Error('사용자 검색 중 오류가 발생하였습니다.')

        const new_access_token = generateToken.access(token.user_id);
        
        return res.status(200).json({
            code: 200,
            message: '토큰이 재발급되었습니다.',
            token: { access_token: new_access_token, refresh_token }
        });
    } catch (error) {
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
        console.error(error)
        next(error)
    }
};