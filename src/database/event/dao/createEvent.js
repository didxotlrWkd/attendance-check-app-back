const { Event } = require('../..');

module.exports = async ({ event_code,description, event_name, location, event_start_time,event_end_time }) => {
    try {
        // 새로운 이벤트 생성
        const event = await Event.create({
            event_code,
            description,  
            event_name,    
            location,      
            event_start_time,
            event_end_time     
        });

        return event; 
    } catch (err) {
        throw err;
    }
};