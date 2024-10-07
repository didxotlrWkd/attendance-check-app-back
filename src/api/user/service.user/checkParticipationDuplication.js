const {Participant} = require('../../../database')

module.exports = async(user_id , event_code) => {
    try{
        const is_duplication = await Participant.findOne({
            where : {
                user_id,
                event_code
            }
        })

        return is_duplication
    }catch(err){
        console.error(err)
        throw err
    }
}