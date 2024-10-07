const {Event} = require('../../../database')

module.exports = async(event_code) => {
    try{
        const event = await Event.findOne({
            where : {
                event_code
            }
        })

        return event
    }catch(err){
        throw err
    }
}