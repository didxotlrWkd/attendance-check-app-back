const express = require('express');
const { saveParticipation, checkAttendance, login, logout, deleteUser ,checkMyInfo, checkEventList} = require('./controller.user');

const router = express.Router()


const authToken = require('../../middleware/authToken');
const generateToken = require('../jwt/controller.jwt/generateToken');
const ratelimit = require('../../middleware/ratelimit');
const allowSpecificAgent = require('../../middleware/allowSpecificAgent');

router.use(allowSpecificAgent)

router.post('/login',ratelimit.loginLimiter, login, generateToken)

router.use(authToken)

router.get('/logout', logout)

router.use(ratelimit.userLimiter)

router.get('/attendance/list', checkAttendance)

router.post('/attendance', saveParticipation)

router.get('/setting/info', checkMyInfo)

router.get('/event/list', checkEventList )

router.delete('/', deleteUser)


module.exports = router;
