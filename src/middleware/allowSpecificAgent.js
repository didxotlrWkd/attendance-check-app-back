require('dotenv').config()

module.exports = (req, res, next) => {
    const userAgent = req.get('User-Agent');
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        // 프로덕션 환경에서는 특정 사용자 에이전트만 허용
        if (userAgent && (userAgent.startsWith('AttendanceCheck') || userAgent === 'okhttp/4.9.3')) {
            next(); // 요청을 계속 처리
        } else {
            res.status(444).send('Forbidden: Invalid User Agent'); // 허용되지 않은 경우
        }
    } else {
        // 개발 환경에서는 모든 요청 허용
        next(); // 요청을 계속 처리
    }
};
