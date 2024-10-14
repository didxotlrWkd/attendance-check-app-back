const { Event, Participant } = require('../../../database');

module.exports = async (user_id) => {
    try {
        const events = await Event.findAll({
            order: [['event_start_time', 'ASC']],

            include : [
                {
                    model : Participant,
                    required : false,
                    where : {
                        user_id
                    }
                }
            ]
        });

        return events; 
    } catch (err) {
        throw err; 
    }
};