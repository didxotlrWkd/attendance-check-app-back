const {Participant, Event} = require('../../../database')
const event = require('../../../database/event/event')

module.exports = async(user_id) => {
    try{
        const attendance_list = Participant.findAll({
            where : {
                user_id
            },
            attributes : [],
            include : [
                {
                    model : Event,
                    attributes : [
                        'event_code',
                        'event_name'
                    ]
                    
                }
            ]
        })
        return attendance_list
    } catch(err){
        throw err
    }
}