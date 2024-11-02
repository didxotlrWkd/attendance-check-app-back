const checkEventByEventCode = require("../../database/event/dao/checkEventByEventCode");
const createUser = require("../../database/user/dao/user/createUser");
const findUserByStudentCode = require("../../database/user/dao/user/findUserByStudentCode");
const increaseParticipantCount = require("../../database/user/dao/user/increaseParticipantCount");
const deleteUserInfo = require("../../database/user/dao/user/deleteUserInfo");
const findUserById = require("../../database/user/dao/user/findUserById");

const checkEventWithParticipant = require("../../database/event/dao/checkEventWithParticipant");

const findParticipantStartingWithTalkConcert = require("../../database/participant/dao/findParticipantStartingWithTalkConcert");

const checkAttendanceList = require("./service.user/checkAttendanceList");
const checkParticipationDuplication = require("./service.user/checkParticipationDuplication");
const saveParticipationRecord = require("./service.user/saveParticipationRecord");

const findRefreshTokenByUserId = require('../jwt/service.jwt/findRefreshTokenByUserId')
const createRefreshTokenBlackList = require('../jwt/service.jwt/createRefreshBlackList');

const { hashPassword, verifyPassword } = require("../../middleware/password");

const decryptUserInfo = require("../admin/service.admin/decryptUserInfo");

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

const saveParticipation = async (req, res) => {
    try {
        const { user_id } = req.decoded;
        const { event_code } = req.body;

        const is_event = await checkEventByEventCode(event_code)
        if (!is_event) {
            return res.status(402).json({ code: 402, error: "존재하지 않는 이벤트 코드입니다." })
        }

        const is_duplication = await checkParticipationDuplication(user_id, event_code);
        if (is_duplication) {
            return res.status(401).json({ code: 401, error: "이미 등록된 코드입니다." })
        }

        await increaseParticipantCount(user_id);
        await saveParticipationRecord(user_id, event_code);
        return res.status(200).json({ message: "saved successfully" })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}


const login = async (req, res, next) => {
    const { major, name, student_code, password } = req.body;

    try {
        const crypt_name = encrypt(name);
        const crypt_student_code = encrypt(student_code);

        const is_user = await findUserByStudentCode({ student_code: crypt_student_code });

        if (is_user) {
            if (is_user.name !== crypt_name || is_user.major !== major) {
                return res.status(406).json({ message: "저장된 회원정보와 일치하지 않습니다." });
            }

            const is_password_valid = await verifyPassword(password, is_user.password);

            if (is_password_valid) {
                req.user_id = is_user.id;
                return next();
            } else {
                return res.status(405).json({ message: "비밀번호가 일치하지 않습니다." });
            }
        } 

        const new_user = await createUser({
            major,
            name: crypt_name,
            student_code: crypt_student_code,
            password: await hashPassword(password)
        });
        
        req.user_id = new_user.id;
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};


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