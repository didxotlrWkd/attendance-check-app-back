require('dotenv').config()

module.exports = (req, res, next) => {
    const userAgent = req.get('User-Agent');
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        if (userAgent && (userAgent.startsWith('AttendanceCheck') || userAgent === 'okhttp/4.9.3')) {
            next();
        } else if(req.ip === '121.152.103.101'){
            return res.status(444).send("정준영씨 한번만 봐주세요")
        }
        else {
            return res.status(444).send("FUCK YOU");
        }
    } else {
        next();
    }
};
