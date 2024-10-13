const express = require('express')
const { checkAllUserInfo, drawRandomParticipant, adminLogin, searchSpecificUser, mainPage ,logout ,  loginPage, drawRandomUserPage, searchEvents, editEventPage, editEvent, addEventPage, addEvent, downloadExcel } = require('./controller.admin')

const {isLoggedIn, isNotLoggedIn} = require('../../middleware/checkSessionLogin')

const router = express.Router()

router.get('/', mainPage)

router.get('/login',isNotLoggedIn, loginPage)

router.post('/login',isNotLoggedIn, adminLogin)

router.get('/userinfo' , isLoggedIn, checkAllUserInfo)

router.post('/draw/random-user',isLoggedIn, drawRandomParticipant)

router.get('/draw/random-user' ,isLoggedIn, drawRandomUserPage)

router.post('/search/specific-user',isLoggedIn, searchSpecificUser)

router.get('/events', isLoggedIn, searchEvents )

router.get('/event/edit', isLoggedIn , editEventPage)

router.post('/event/edit', isLoggedIn , editEvent)

router.get('/event/create', isLoggedIn, addEventPage)

router.post('/event', isLoggedIn, addEvent)

router.get('/download/student-info', downloadExcel)

router.get('/logout', isLoggedIn, logout)




module.exports = router;
