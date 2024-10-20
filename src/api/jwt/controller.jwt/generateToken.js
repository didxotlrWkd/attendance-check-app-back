const generateToken = require('../service.jwt/generateToken')
const saveRefreshToken = require('../service.jwt/saveRefreshToken');

const findUserById = require('../../../database/user/dao/user/findUserById');

module.exports = async (req, res, next) => {
  try {
    const user_id = req.user_id || req.body.user_id

    const is_user = await findUserById(user_id)
    if (!is_user) {
      throw new Error('해당 유저를 찾을 수 없습니다.')
    }

    let access_token = generateToken.access(user_id);
    let refresh_token = generateToken.refresh(user_id);
    // refreshToken 저장
    await saveRefreshToken(refresh_token, user_id)
    //response
    return res.status(200).json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token: { access_token, refresh_token }
    });
  } catch (error) {
    console.error(error)
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

    res.status(500).json({error : error.message})
  }
};
