const express = require('express');

const router = express.Router();

const adminRouter = require('../api/admin/routes.admin')
const userRouter = require('../api/user/routes.user')
const jwtRouter = require('../api/jwt/route.jwt')

router.use('/admin', adminRouter)
router.use('/user', userRouter)
router.use('/jwt', jwtRouter)

router.get('/' , (req,res) => {
    res.send("hihi");
})

router.get('/favicon.ico', (req, res) => {
    res.sendStatus(204); // 빈 응답
});

// //error test

// router.get('/429', (req, res) => {
//     res.status(429).send('Too Many Login Requests');
// });

// router.get('/430', (req,res) => {
//     res.status(430).send('Too Many Requests')
// })

// router.get('/401', (req,res) => {
//     res.status(401).send('유효하지 않은 토큰')
// })


// router.get('/420', (req, res) => {
//     res.status(420).send('Enhance Your Calm');
// });

// router.get('/451', (req, res) => {
//     res.status(451).send('존재하지않는코드');
// });

// router.get('/452', (req, res) => {
//     res.status(452).send('이미 등록된 코드');
// });


// router.get('/405', (req, res) => {
//     res.status(405).send('비밀번호 틀림');
// });

// router.get('/406', (req, res) => {
//     res.status(406).send('회원정보 불일치');
// });

// router.get('/412', (req, res) => {
//     res.status(412).send('중복로그인');
// });

// router.get('/409', (req, res) => {
//     res.status(409).send('삭제된 계정');
// });


module.exports = router;
