const { Event } = require('../..');

module.exports = async ({ event_code, event_name, location, event_time }) => {
    try {
        // 이벤트 코드로 특정 이벤트를 찾기
        const event = await Event.findOne({ where: { event_code } });

        // 이벤트가 존재하지 않는 경우 에러 처리
        if (!event) {
            throw new Error('이벤트를 찾을 수 없습니다.');
        }

        // 이벤트 정보 수정
        event.event_name = event_name;
        event.location = location;
        event.event_time = event_time;

        // 변경사항 저장
        await event.save();

        return event; // 업데이트된 이벤트 반환
    } catch (err) {
        throw err; // 에러 발생 시 다시 throw
    }
};
