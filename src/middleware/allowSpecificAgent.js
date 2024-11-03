module.exports = (req, res, next) => {
    const userAgent = req.get('User-Agent');

    if (userAgent && (userAgent.startsWith('AttendanceCheck') || userAgent === 'okhttp/4.9.3')) {
        next();
    } else {
        res.status(444).send('Fuck you'); 
    }
};