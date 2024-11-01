const checkEventByEventCode = require("../../database/event/dao/checkEventByEventCode");
const createUser = require("../../database/user/dao/user/createUser");
const findUserByStudentCode = require("../../database/user/dao/user/findUserByStudentCode");
const increaseParticipantCount = require("../../database/user/dao/user/increaseParticipantCount");
const deleteUserInfo = require("../../database/user/dao/user/deleteUserInfo");
const findUserById = require("../../database/user/dao/user/findUserById");

const getAllEvents = require("../../database/event/dao/getAllEvents");
const checkEventWithParticipant = require("../../database/event/dao/checkEventWithParticipant");

const findParticipantStartingWithTalkConcert = require("../../database/participant/dao/findParticipantStartingWithTalkConcert");

const checkAttendanceList = require("./service.user/checkAttendanceList");
const checkParticipationDuplication = require("./service.user/checkParticipationDuplication");
const saveParticipationRecord = require("./service.user/saveParticipationRecord");

const findRefreshTokenByUserId = require('../jwt/service.jwt/findRefreshTokenByUserId')
const createRefreshTokenBlackList = require('../jwt/service.jwt/createRefreshBlackList');

const decryptUserInfo = require("../admin/service.admin/decryptUserInfo");
const identifyUser = require("../../database/user/dao/user/identifyUser");
const { encrypt } = require("../../utils/crypt");

const checkAttendance = async (req, res) => {
    const { user_id } = req.decoded;

    try {
        const attendance_list = await checkAttendanceList(user_id)

        return res.status(200).json(attendance_list)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}

// const saveParticipation = async (req, res) => {
//     const { user_id } = req.decoded;

//     const { event_code } = req.body;
//     try {

//         const is_event = await checkEventByEventCode(event_code)
//         if (!is_event) {
//             return res.status(402).json({ code: 402, error: "존재하지 않는 이벤트 코드입니다." })
//         }

//         const is_duplication = await checkParticipationDuplication(user_id, event_code);
//         if (is_duplication) {
//             return res.status(401).json({ code: 401, error: "이미 등록된 코드입니다." })
//         }

//         const isTalkConcert = event_code.startsWith("SCHUSWCU1stAF_GraduatedTalkConcert");

//         const results = isTalkConcert ? await findParticipantStartingWithTalkConcert(event_code, user_id) : null;

//         if (!results) {
//             await increaseParticipantCount(user_id);
//         }

//         await saveParticipationRecord(user_id, event_code);
//         return res.status(200).json({ message: "saved successfully" })
//     } catch (err) {
//         console.error(err)
//         return res.status(500).json({ error: err.message })
//     }
// }

const logger = require('../../middleware/logger')

const saveParticipation = async (req, res) => {
    const { user_id } = req.decoded;
    const { event_code } = req.body;

    try {
        const startCheckEvent = Date.now();
        const is_event = await checkEventByEventCode(event_code);
        const durationCheckEvent = Date.now() - startCheckEvent;
        logger.info(`checkEventByEventCode duration: ${durationCheckEvent}ms`);

        if (!is_event) {
            return res.status(402).json({ code: 402, error: "존재하지 않는 이벤트 코드입니다." });
        }

        const startCheckDuplication = Date.now();
        const is_duplication = await checkParticipationDuplication(user_id, event_code);
        const durationCheckDuplication = Date.now() - startCheckDuplication;
        logger.info(`checkParticipationDuplication duration: ${durationCheckDuplication}ms`);

        if (is_duplication) {
            return res.status(401).json({ code: 401, error: "이미 등록된 코드입니다." });
        }

        const isTalkConcert = event_code.startsWith("SCHUSWCU1stAF_GraduatedTalkConcert");

        let results = null;
        if (isTalkConcert) {
            const startFindParticipant = Date.now();
            results = await findParticipantStartingWithTalkConcert(event_code, user_id);
            const durationFindParticipant = Date.now() - startFindParticipant;
            logger.info(`findParticipantStartingWithTalkConcert duration: ${durationFindParticipant}ms`);
        }

        if (!results) {
            const startIncreaseCount = Date.now();
            await increaseParticipantCount(user_id);
            const durationIncreaseCount = Date.now() - startIncreaseCount;
            logger.info(`increaseParticipantCount duration: ${durationIncreaseCount}ms`);
        }

        const startSaveRecord = Date.now();
        await saveParticipationRecord(user_id, event_code);
        const durationSaveRecord = Date.now() - startSaveRecord;
        logger.info(`saveParticipationRecord duration: ${durationSaveRecord}ms`);

        return res.status(200).json({ message: "saved successfully" });
    } catch (err) {
        logger.error(err.message);
        return res.status(500).json({ error: err.message });
    }
}

const login = async (req, res, next) => {
    const { major, name, student_code } = req.body
    try {
        const crypt_name = encrypt(name)
        const crypt_student_code = encrypt(student_code)
        const is_user_student_code = await findUserByStudentCode({ student_code: crypt_student_code })
        if (is_user_student_code) {
            const is_user = await identifyUser({ student_code: crypt_student_code, name: crypt_name, major })
            if (is_user) {
                req.user_id = is_user.id
                return next()
            } else { 
                return res.status(401).json({message : "저장된 회원정보와 일치하지 않습니다."})
            }
        }
        const user = await createUser({ major, name: crypt_name, student_code: crypt_student_code })
        req.user_id = user.id
        return next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}

const logout = async (req, res, next) => {
    try {
        const token = req.decoded

        const refresh_token = await findRefreshTokenByUserId(token.user_id)
        if (!refresh_token) throw new Error('해당 유저 정보로 일치하는 토큰을 찾지 못하였습니다.')

        const create_token_blackList = await createRefreshTokenBlackList(refresh_token.refresh_token)
        if (!create_token_blackList) throw new Error('토큰 블랙리스트 생성 중 오류가 발생하였습니다.')

        return res.status(200).json({ message: '로그아웃 성공' })
    } catch (err) {
        console.error(err)
        next(err)
    }
}

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.decoded
        await deleteUserInfo(user_id)

        res.status(200).json({ message: 'user delete successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const checkMyInfo = async (req, res) => {
    const { user_id } = req.decoded
    try {
        const encrypt_user_info = await findUserById(user_id)
        const decrypt_user_info = await decryptUserInfo([encrypt_user_info])
        res.status(200).json(decrypt_user_info)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const checkEventList = async (req, res) => {

    const { user_id } = req.decoded

    try {
        const event_list = await checkEventWithParticipant(user_id)
        return res.status(200).json(event_list)
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

module.exports = {
    checkAttendance,
    saveParticipation,
    login,
    logout,
    deleteUser,
    checkEventList,
    checkMyInfo
}