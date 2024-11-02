// ratelimit.js
const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
   windowMs: 60 * 1000, // 1분 간격
   max: 5, // windowMs 동안 최대 호출 횟수
   statusCode: 429, // 기본 상태 코드 설정
   handler(req, res) {
      res.status(this.statusCode).json({
         code: this.statusCode,
         message: '1분에 10번만 요청할 수 있습니다.',
      });
   },
});

exports.userLimiter = rateLimit({
   windowMs: 60 * 1000, // 1분 간격
   max: 100, // windowMs 동안 최대 호출 횟수
   statusCode: 429, // 기본 상태 코드 설정
   handler(req, res) {
      res.status(this.statusCode).json({
         code: this.statusCode,
         message: '1분에 100번만 요청할 수 있습니다.',
      });
   },
});



