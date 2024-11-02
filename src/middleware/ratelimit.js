// ratelimit.js
const rateLimit = require('express-rate-limit');

const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
   windowMs: 30 * 1000, 
   max: 10, 
   statusCode: 429, 
   keyGenerator: (req) => {
      return req.ip + '-' + (req.body ? req.body.student_code : 'anonymous'); 
   },
   handler(req, res) {
      res.status(this.statusCode).json({
         code: this.statusCode,
         message: '30초에 10번만 요청할 수 있습니다.',
      });
   },
});


exports.userLimiter = rateLimit({
   windowMs: 60 * 1000, // 1분 간격
   max: 50, // windowMs 동안 최대 호출 횟수
   statusCode: 430, // 기본 상태 코드 설정
   keyGenerator: (req) => {
      console.log(req.ip + '-' + (req.user_id ? req.user_id : 'anonymous'))
      return req.ip + '-' + (req.user_id ? req.user_id : 'anonymous'); 
   },
   handler(req, res) {
      res.status(this.statusCode).json({
         code: this.statusCode,
         message: '60초에 50번만 요청할 수 있습니다.',
      });
   },
});



