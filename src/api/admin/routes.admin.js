const express = require('express')
const { checkAllUserInfo, drawRandomParticipant, adminLogin, searchSpecificUser, mainPage, logout, loginPage, drawRandomUserPage, searchEvents, editEventPage, editEvent, addEventPage, addEvent, downloadExcel, drawRandomUserPageForProjector, drawRandomUserResultPageForProjector, editUser, deleteUserByAdmin, editUserPage, editUserPassword, searchUserById } = require('./controller.admin')

const { isLoggedIn, isNotLoggedIn } = require('../../middleware/checkSessionLogin')

const checkEventByEventCode = require('../../database/event/dao/checkEventByEventCode')

const validate = require('../../middleware/validate')
const { body } = require('express-validator');

const ratelimit = require('../../middleware/ratelimit');

const session = require('express-session');

const RedisStore = require("connect-redis").default
const redis = require('redis');
const { encrypt } = require('../../utils/crypt')
const { Participant } = require('../../database')
const findUserById = require('../../database/user/dao/user/findUserById')
const increaseParticipantCount = require('../../database/user/dao/user/increaseParticipantCount')


const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
})

redisClient.connect()
    .then(() => {
        console.log('Redis client connected successfully');
    })
    .catch((err) => {
        console.error('Redis connection error:', err);
    });


const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
});

const router = express.Router()


router.use(sessionMiddleware)

router.use(ratelimit.adminLimiter)

router.get('/', mainPage)

router.get('/login', isNotLoggedIn, loginPage)

router.post('/login',
    validate([
        body('id').isString(),
        body('password').isString(),
    ]),
    isNotLoggedIn,
    adminLogin)

router.get('/userinfo', isLoggedIn, checkAllUserInfo)

// router.post('/user/delete', isLoggedIn ,)

router.post('/user/edit',
    validate([
        body('user_id').isString(),
        body('student_code').isString(),
        body('major').isString(),
        body('name').isString(),
    ]),
    isLoggedIn,
    editUser)

router.post('/user/delete',
    validate([
        body('user_id').isString(),
    ]),
    isLoggedIn,
    deleteUserByAdmin)

router.post('/user/edit/page',
    validate([
        body('user_id').isString(),
    ]),
    isLoggedIn,
    editUserPage)

router.post('/user/edit/password',
    validate([
        body('user_id').isString(),
        body('new_password').isString(),
    ]),
    isLoggedIn,
    editUserPassword)

router.post('/draw/random-user',
    validate([
        body('number_of_draw').isString(),
        body('participant_count').isString(),
    ]),
    isLoggedIn,
    drawRandomParticipant)

router.get('/draw/random-user', isLoggedIn, drawRandomUserPage)

router.get('/draw/random-user/project', isLoggedIn, drawRandomUserPageForProjector)

router.post('/draw/random-user/project',
    isLoggedIn,
    drawRandomUserResultPageForProjector)

router.post('/search/specific-user', isLoggedIn, searchSpecificUser)

router.get('/events', isLoggedIn, searchEvents)

router.get('/event/edit', isLoggedIn, editEventPage)

router.post('/search/id', isLoggedIn, searchUserById )

router.post('/event/edit',
    validate([
        body('event_code').isString(),
        body('description').isString(),
        body('event_name').isString(),
        body('location').isString(),
        body('event_start_time').isString(),
        body('event_end_time').isString(),
    ]),
    isLoggedIn,
    editEvent)

router.get('/event/create', isLoggedIn, addEventPage)

router.post('/event',
    validate([
        body('event_code').isString(),
        body('description').isString(),
        body('event_name').isString(),
        body('location').isString(),
        body('event_start_time').isString(),
        body('event_end_time').isString(),
    ]),
    isLoggedIn,
    addEvent)

router.get('/download/student-info', isLoggedIn, downloadExcel)

router.get('/logout', isLoggedIn, logout)

// router.post('/encrypt' , (req,res) => {
//     try{
//         const data = encrypt(req.body.data)
//         res.send(data)
//     }catch(err){
//         res.send('sorry')
//     }
// })

// router.post('/add/attendance', async (req,res) => {
//     try{
//         const {user_id , event_code_id} = req.body
//         const event_code = {
//             1 : '1stAcademicFesival,OpeningCeremony,SWConvergenceCollege,SoonchunhyangUniversity',
//             2 : '1stAcademicFesival,ProjectPresentationParticipation,SWConvergenceCollege,SoonchunhyangUniversity',
//             3 : '1stAcademicFesival,GraduatedStudentTalkConcert,SWConvergenceCollege,SoonchunhyangUniversity',
//             4 : '1stAcademicFesival,MadeByStudentsGameContest,SWConvergenceCollege,SoonchunhyangUniversity',
//             5 : '1stAcademicFesival,IndustrialSpecialistSpecialLecture,SWConvergenceCollege,SoonchunhyangUniversity'
//         }

//         event_code_id.map(async (id) => {
//             await Participant.create({
//                 user_id,
//                 event_code : event_code[id]
//             })
//             await increaseParticipantCount(user_id)
//         })

//         res.send("ok")
//     }catch(err){
//         console.error(err)
//         res.status(500).json({error : err.message})
//     }
// })


// router.get('/event/delete', async (req, res) => {
//     const { event_code } = req.query;

//     try {
//         const event = await checkEventByEventCode(event_code);

//         if (!event) {
//             return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
//         }


//         await event.destroy();

//         return res.status(200).json({ message: '이벤트가 성공적으로 삭제되었습니다.' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
// });

module.exports = router;
