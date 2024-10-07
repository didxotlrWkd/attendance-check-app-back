const express = require('express')
const {User} = require('../../database')
const { decrypt } = require('../../utils/crypt')
const { checkAllUserInfo, drawRandomParticipant, adminLogin, searchSpecificUser } = require('./controller.admin')

const router = express.Router()

router.post('/login', adminLogin)

router.get('/userinfo' , checkAllUserInfo)

router.post('/draw/random-user', drawRandomParticipant)

router.post('/search/specific-user', searchSpecificUser)



module.exports = router;
