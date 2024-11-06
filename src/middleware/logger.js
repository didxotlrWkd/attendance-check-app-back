const winston = require('winston');
const path = require('path');
const fs = require('fs');

// 로그 파일 경로 설정
const logDirectory = path.join(__dirname, '../../logs');

// logs 폴더가 존재하지 않으면 생성
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// 로그 파일 설정
const createLogger = (filename, level) => {
    return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.File({ filename: path.join(logDirectory, filename), level, handleExceptions: true }),
        ],
    });
};

const successLogger = createLogger('success.log','info');
const tokenErrorLogger = createLogger('token_error.log', 'warn');
const externalAccessLogger = createLogger('external_access.log', 'error');
const serverErrorLogger = createLogger('server_error.log', 'error');
const qrErrorLogger = createLogger('qr_error.log', 'error');
const loginErrorLogger = createLogger('login_error.log', 'error');
const ratelimitLogger = createLogger('rate_limit_error.log' , 'error')
const elesLogger = createLogger('else.log', 'else')

// 로그 저장 함수
function logRequest(req, res, next) {
    const start = Date.now(); // 요청 시작 시간 기록
    res.on('finish', () => {
        const duration = Date.now() - start; // 요청 처리 시간 계산
        const { statusCode } = res;
        const logData = {
            ip: req.ip,
            status: res.statusCode,
            method: req.method,
            url: req.originalUrl,
            responseTime: `${duration} ms`,
            userAgent: req.headers['user-agent'],
            userId: req.decoded ? req.decoded.user_id : req.body.student_code,
        };

        // 상태 코드에 따라 로그 파일에 기록
        switch (statusCode) {
            case 200:
                successLogger.info(logData)
                break;
            case 451:
            case 452:
                qrErrorLogger.error(logData);
                break;
            case 406:
            case 405:
                loginErrorLogger.error(logData);
                break;
            case 401:
            case 412:
            case 409:
            case 419:
                tokenErrorLogger.warn(logData);
                break;
            case 444:
                externalAccessLogger.error(logData);
                break;
            case 429:
            case 430:
                ratelimitLogger.error(logData);
                break;
            case 500:
                serverErrorLogger.error(logData);
                break;
            default:
                elesLogger.error(logData)
                break;
        }
    });
    next();
}

module.exports = { logRequest };
