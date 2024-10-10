const express = require('express');
const { saveParticipation, checkAttendance, login, logout, deleteUser } = require('./controller.user');

const router = express.Router()


const authToken = require('../../middleware/authToken');
const generateToken = require('../jwt/controller.jwt/generateToken');

router.post('/login', login, generateToken)

router.use(authToken)

router.get('/attendance/list', checkAttendance)

router.post('/attendance', saveParticipation)

router.get('/logout', logout)

router.get('/setting/info', checkMyInfo)

router.delete('/', deleteUser)


module.exports = router;
