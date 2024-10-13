const { Event } = require('../..');

module.exports = async ({ event_code, event_name, location, event_time }) => {
    try {
        // 새로운 이벤트 생성
        const event = await Event.create({
            event_code,  
            event_name,    
            location,      
            event_time     
        });

        return event; 
    } catch (err) {
        throw err;
    }
};