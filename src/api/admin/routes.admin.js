const express = require('express')
const { checkAllUserInfo, drawRandomParticipant, adminLogin, searchSpecificUser, mainPage ,logout ,  loginPage, drawRandomUserPage } = require('./controller.admin')

const {isLoggedIn, isNotLoggedIn} = require('../../middleware/login')

const router = express.Router()


router.get('/', mainPage)

router.get('/login', loginPage)

router.post('/login', adminLogin)

router.get('/userinfo' , checkAllUserInfo)

router.post('/draw/random-user', drawRandomParticipant)

router.get('/draw/random-user' , drawRandomUserPage)

router.post('/search/specific-user', searchSpecificUser)

router.get('/logout', logout)



module.exports = router;
