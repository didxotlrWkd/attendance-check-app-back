require('dotenv').config()
const checkEventByEventCode = require('../../database/event/dao/checkEventByEventCode');
const createEvent = require('../../database/event/dao/createEvent');
const getAllEvents = require('../../database/event/dao/getAllEvents');
const modifyEvent = require('../../database/event/dao/modifyEvent');
const addDrawnUser = require('../../database/user/dao/drawnUser/addDrawnUser');
const checkDrawnUser = require('../../database/user/dao/drawnUser/checkDrawnUser');
const checkUserInfoByParticipantCount = require('../../database/user/dao/user/checkUserInfoByParticipantCount');
const drawRandomUserParticipant5 = require('../../database/user/dao/user/drawRandomUserParticipant5');
const drawRandomUserSelectedNumber = require('../../database/user/dao/user/drawRandomUserSelectedNumber');
const findUserByStudentCode = require('../../database/user/dao/user/findUserByStudentCode');
const { decrypt, encrypt } = require('../../utils/crypt');
const createExelFile = require('./service.admin/createExelFile');
const decryptUserInfo = require('./service.admin/decryptUserInfo');

const loginPage = async (req, res, next) => {
    try {
        res.render('login')
    } catch (err) {
        console.error(err.stack);
        next(err);
    }
}


const mainPage = async (req, res) => {
    if (req.session.isLoggedIn) {
        res.render('adminMainPage'); // 로그인 상태일 경우 관리자 페이지 렌더링
    } else {
        res.redirect('/admin/login'); // 로그인 상태가 아닐 경우 로그인 페이지로 리디렉션
    }
}

const adminLogin = async (req, res) => {
    const { id, password } = req.body;

    try {
        if (id !== process.env.adminId || password !== process.env.adminPassword) {
            res.redirect('/admin/login');
        } else {
            req.session.isLoggedIn = true;
            return res.render('adminMainPage')
        }
    } catch (err) {
        res.redirect('/admin/login')
    }
}

const checkAllUserInfo = async (req, res) => {
    try {
        const encrypt_user_info = await checkUserInfoByParticipantCount()

        const decrypt_user_info = await decryptUserInfo(encrypt_user_info)

        return res.render('adminDashboard', {
            users: decrypt_user_info
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
};

const drawRandomParticipant = async (req, res) => {
    const { number_of_draw, participant_count } = req.body;
    try {

        const encrypt_drawn_user = await drawRandomUserSelectedNumber({ number_of_draw: Number(number_of_draw), participant_count: Number(participant_count) })

        const decrypt_drawn_user = await decryptUserInfo(encrypt_drawn_user)

        return res.render('drawPage', {
            users: decrypt_drawn_user
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const searchSpecificUser = async (req, res) => {
    const { student_code } = req.body
    try {
        const encrypt_student_code = encrypt(student_code)

        const user = await findUserByStudentCode({ student_code: encrypt_student_code })
        if (!user) {
            throw new Error("존재하지 않는 학번입니다.")
        }
        const decrypt_user_info = await decryptUserInfo([user])

        return res.render('adminDashboard', {
            users: decrypt_user_info
        })
    } catch (err) {
        return res.render('adminDashboard')
    }
}

const drawRandomUserPage = async (req, res) => {
    try {
        return res.render('drawPage')
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const drawRandomUserPageForProjector = async (req, res) => {
    try {
        return res.render('drawPageForProject')

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const drawRandomUserResultPageForProjector = async (req, res) => {
    const animations = [
        "animate__animated animate__fadeIn",
        "animate__animated animate__bounce",
        "animate__animated animate__zoomIn",
        "animate__animated animate__lightSpeedInLeft",
        "animate__animated animate__backInDown",
        "animate__animated animate__backInUp",
        "animate__animated animate__bounceInDown",
        "animate__animated animate__fadeInDown"
    ];
    try {
        const drawn_ids = await checkDrawnUser()

        const encrypt_drawn_user = await drawRandomUserParticipant5({ drawn_ids})

        if (encrypt_drawn_user) {
            await addDrawnUser(encrypt_drawn_user.id);
            const randomIndex = Math.floor(Math.random() * animations.length);
            const selectedAnimation = animations[randomIndex];
    
            const decrypt_drawn_user = await decryptUserInfo([encrypt_drawn_user])
    
            return res.render('drawPageForProject', {
                users: decrypt_drawn_user,
                animation_class: selectedAnimation
            })
        }
        return res.render('drawPageForProject', {
            users : null,
            animation_class : "table",
            message: "추첨 가능 인원이 없습니다."
        })

        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

const searchEvents = async (req, res) => {
    try {
        const events = await getAllEvents()

        return res.render('eventPage', {
            events: events
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}

const editEventPage = async (req, res) => {
    const { event_code } = req.query;
    try {
        const event = await checkEventByEventCode(event_code)
        return res.render('editEventPage', { event });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
};

const editEvent = async (req, res) => {
    const { event_code, description, event_name, location, event_start_time, event_end_time } = req.body
    try {
        await modifyEvent({ event_code, description, event_name, location, event_start_time, event_end_time })
        const events = await getAllEvents()

        return res.render('eventPage', {
            events: events
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}

const addEventPage = async (req, res) => {
    try {
        return res.render('addEventPage')
    } catch (err) {
        console.error(err)
    }
}

const addEvent = async (req, res) => {

    const { event_code, event_name, description, location, event_start_time, event_end_time } = req.body

    try {

        const event = await checkEventByEventCode(event_code)

        if (event) {
            return res.render('eventPage', {
                error: '중복된 행사 코드입니다.', // 에러 메시지
                events: await getAllEvents() // 기존 이벤트 목록 가져오기
            });
        }

        await createEvent({ event_code, event_name, description, location, event_start_time, event_end_time })
        const events = await getAllEvents()

        return res.render('eventPage', {
            events: events
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const downloadExcel = async (req, res) => {

    try {
        const encrypt_user_info = await checkUserInfoByParticipantCount()
        const decrypt_user_info = await decryptUserInfo(encrypt_user_info)
        const excelPath = await createExelFile(decrypt_user_info)

        res.download(excelPath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('파일 다운로드에 실패했습니다.');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
    adminLogin,
    checkAllUserInfo,
    drawRandomParticipant,
    searchSpecificUser,
    loginPage,
    mainPage,
    drawRandomUserPage,
    searchEvents,
    editEventPage,
    addEventPage,
    addEvent,
    editEvent,
    downloadExcel,
    logout,
    drawRandomUserPageForProjector,
    drawRandomUserResultPageForProjector

}