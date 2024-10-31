const express = require('express')
const { checkAllUserInfo, drawRandomParticipant, adminLogin, searchSpecificUser, mainPage ,logout ,  loginPage, drawRandomUserPage, searchEvents, editEventPage, editEvent, addEventPage, addEvent, downloadExcel, drawRandomUserPageForProjector, drawRandomUserResultPageForProjector, editUser, deleteUserByAdmin, editUserPage } = require('./controller.admin')

const {isLoggedIn, isNotLoggedIn} = require('../../middleware/checkSessionLogin')
const checkEventByEventCode = require('../../database/event/dao/checkEventByEventCode')
const { deleteUser } = require('../user/controller.user')

const router = express.Router()

router.get('/', mainPage)

router.get('/login',isNotLoggedIn, loginPage)

router.post('/login',isNotLoggedIn, adminLogin)

router.get('/userinfo' , isLoggedIn, checkAllUserInfo)

// router.post('/user/delete', isLoggedIn ,)

router.post('/user/edit',isLoggedIn, editUser)

router.post('/user/delete',isLoggedIn, deleteUserByAdmin)

router.post('/user/edit/page' ,isLoggedIn, editUserPage )

router.post('/draw/random-user',isLoggedIn, drawRandomParticipant)

router.get('/draw/random-user' ,isLoggedIn, drawRandomUserPage)

router.get('/draw/random-user/project', isLoggedIn , drawRandomUserPageForProjector)

router.post('/draw/random-user/project' , isLoggedIn , drawRandomUserResultPageForProjector)

router.post('/search/specific-user',isLoggedIn, searchSpecificUser)

router.get('/events', isLoggedIn, searchEvents )

router.get('/event/edit', isLoggedIn , editEventPage)

router.post('/event/edit', isLoggedIn , editEvent)

router.get('/event/create', isLoggedIn, addEventPage)

router.post('/event', isLoggedIn, addEvent)

router.get('/download/student-info',isLoggedIn, downloadExcel)

router.get('/logout', isLoggedIn, logout)



router.get('/event/delete', async (req, res) => {
    const { event_code } = req.query;
    
    try {
        const event = await checkEventByEventCode(event_code);
        
        if (!event) {
            return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
        }

  
        await event.destroy();

        return res.status(200).json({ message: '이벤트가 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
