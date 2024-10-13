require('dotenv').config()
const jwt = require('jsonwebtoken');

//jwt.sign(payload, secretOrPrivateKey, [options, callback])

// access token을 secret key 기반으로 생성
const access = (user_id) => {
    try{
        token = jwt.sign({
            type: 'access_token',
            user_id: user_id,
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15d", // 만료시간 15분
            issuer: 'hongsi',
        });
        return token
    } catch (err) {
        console.error(err)

    }
  
};

const refresh = (user_id) => {
    token = jwt.sign({
        type: 'refresh_token',
        user_id: user_id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "15d",
        issuer: 'hongsi',
    });
  
    return token
}


module.exports = {
    access,
    refresh
}