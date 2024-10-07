require('dotenv').config()
const { User, sequelize , Sequelize} = require('../../database');
const checkUserInfoByParticipantCount = require('../../database/user/dao/checkUserInfoByParticipantCount');
const drawRandomUserSelectedNumber = require('../../database/user/dao/drawRandomUserSelectedNumber');
const findUserByStudentCode = require('../../database/user/dao/findUserByStudentCode');
const { decrypt, encrypt } = require('../../utils/crypt');
const decryptUserInfo = require('./service.admin/decryptUserInfo');

const adminLogin = async (req, res) => {
    const { id, password } = req.body;

    try {
        if (id !== process.env.adminId || password !== process.env.adminPassword) {
            return res.status(500).json({ message: "아이디 혹은 비밀번호가 맞지 않습니다." })
        }

        return res.status(200).json({ message: "admin login successfully" })
    } catch (err) {
        return res.status(401).json({ error: err.message })
    }
}

const checkAllUserInfo = async (req, res) => {
    try {
        const encrypt_user_info = await checkUserInfoByParticipantCount()

        const decrypt_user_info = await decryptUserInfo(encrypt_user_info)

        return res.status(200).json(decrypt_user_info);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const drawRandomParticipant = async (req, res) => {
    const { number_of_draw, participant_count } = req.body;
    try {
        const encrypt_drawn_user = await drawRandomUserSelectedNumber({number_of_draw, participant_count})

        const decrypt_drawn_user = await decryptUserInfo(encrypt_drawn_user)

        return res.status(200).json(decrypt_drawn_user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const searchSpecificUser = async(req,res) => {
    const {student_code} = req.body
    try{
        const encrypt_student_code = encrypt(student_code)

        const user = await findUserByStudentCode({student_code : encrypt_student_code})
        if(!user) {
            throw new Error("존재하지 않는 학번입니다.")
        }
        const decrypt_user_info = await decryptUserInfo([user])

        return res.status(200).json(decrypt_user_info)
    }catch(err) {
        res.status(500).json({error : err.message})
    }
}

module.exports = {
    adminLogin,
    checkAllUserInfo,
    drawRandomParticipant,
    searchSpecificUser
}