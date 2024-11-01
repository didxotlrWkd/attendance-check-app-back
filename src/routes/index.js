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

module.exports = router;
