const { Event } = require('../..');

module.exports = async ({ event_code,description, event_name, location, event_start_time,event_end_time }) => {
    try {

        const event_start_time_utc = new Date(new Date(event_start_time).getTime() - (9 * 60 * 60 * 1000));
        const event_end_time_utc = new Date(new Date(event_end_time).getTime() - (9 * 60 * 60 * 1000));

        // 새로운 이벤트 생성
        const event = await Event.create({
            event_code,
            description,  
            event_name,    
            location,      
            event_start_time: event_start_time_utc,
            event_end_time: event_end_time_utc
        });

        return event; 
    } catch (err) {
        throw err;
    }
};