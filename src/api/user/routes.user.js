const express = require('express');
const { saveParticipation, checkAttendance, login, logout } = require('./controller.user');

const router = express.Router()

const authToken = require('../../middleware/authToken');
const generateToken = require('../jwt/controller.jwt/generateToken');

router.post('/login', login, generateToken)

router.use(authToken)

router.get('/attendance/list', checkAttendance)

router.post('/attendance', saveParticipation)

router.get('/logout', logout)


module.exports = router;
