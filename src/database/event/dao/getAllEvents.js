const { Event } = require('../../../database');

module.exports = async () => {
    try {
        // event_time을 기준으로 오름차순 정렬 (가장 빠른 날짜가 먼저)
        const events = await Event.findAll({
            order: [['event_time', 'ASC']] // ASC는 오름차순
        });

        return events; // 정렬된 이벤트 목록 반환
    } catch (err) {
        throw err; // 에러 발생 시 다시 throw
    }
};