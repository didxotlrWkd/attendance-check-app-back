const {Participant} = require('../../../database')

module.exports = async(user_id , event_code) => {
    try{
        await Participant.create({
            user_id,
            event_code
        })
    } catch(err){
        throw err
    }
}