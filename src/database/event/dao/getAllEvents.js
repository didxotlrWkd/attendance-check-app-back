const { Event } = require('../../../database');

module.exports = async () => {
    try {
        const events = await Event.findAll({
            order: [['event_start_time', 'ASC']]
        });

        return events; 
    } catch (err) {
        throw err; 
    }
};