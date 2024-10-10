require('dotenv').config()
const { where } = require('sequelize');
const { User, sequelize, Sequelize } = require('../../database');
const checkUserInfoByParticipantCount = require('../../database/user/dao/checkUserInfoByParticipantCount');
const drawRandomUserSelectedNumber = require('../../database/user/dao/drawRandomUserSelectedNumber');
const findUserByStudentCode = require('../../database/user/dao/findUserByStudentCode');
const { decrypt, encrypt } = require('../../utils/crypt');
const decryptUserInfo = require('./service.admin/decryptUserInfo');
const path = require('path')

const loginPage = async (req, res, next) => {
    try {
        res.render('login')
    } catch (err) {
        console.error(err.stack);
        next(err);
    }
}


const mainPage = async (req, res) => {
    if (req.session.isLoggedIn) {
        res.render('adminMainPage'); // 로그인 상태일 경우 관리자 페이지 렌더링
    } else {
        res.redirect('/admin/login'); // 로그인 상태가 아닐 경우 로그인 페이지로 리디렉션
    }
}

const adminLogin = async (req, res) => {
    const { id, password } = req.body;

    try {
        if (id !== process.env.adminId || password !== process.env.adminPassword) {
            res.redirect('/admin/login');
        } else {
            req.session.isLoggedIn = true;
            return res.render('adminMainPage')
        }
    } catch (err) {
        res.redirect('/admin/login')
    }
}

const checkAllUserInfo = async (req, res) => {
    try {
        const encrypt_user_info = await checkUserInfoByParticipantCount()

        const decrypt_user_info = await decryptUserInfo(encrypt_user_info)

        return res.render('adminDashboard', {
            users: decrypt_user_info
        })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const drawRandomParticipant = async (req, res) => {
    const { number_of_draw, participant_count } = req.body;
    try {

        const encrypt_drawn_user = await drawRandomUserSelectedNumber({ number_of_draw: Number(number_of_draw), participant_count: Number(participant_count) })

        const decrypt_drawn_user = await decryptUserInfo(encrypt_drawn_user)

        return res.render('drawPage', {
            users: decrypt_drawn_user
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const searchSpecificUser = async (req, res) => {
    const { student_code } = req.body
    try {
        const encrypt_student_code = encrypt(student_code)

        const user = await findUserByStudentCode({ student_code: encrypt_student_code })
        if (!user) {
            throw new Error("존재하지 않는 학번입니다.")
        }
        const decrypt_user_info = await decryptUserInfo([user])

        return res.render('adminDashboard', {
            users: decrypt_user_info
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const drawRandomUserPage = async (req, res) => {
    try {
        return res.render('drawPage')
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const logout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


module.exports = {
    adminLogin,
    checkAllUserInfo,
    drawRandomParticipant,
    searchSpecificUser,
    loginPage,
    mainPage,
    drawRandomUserPage,
    logout,
}