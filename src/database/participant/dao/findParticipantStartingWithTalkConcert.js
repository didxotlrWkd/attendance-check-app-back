const {Participant} = require('../../../database')
const { Op } = require('sequelize');

module.exports = async(event_code, user_id) => {
    try {
        const results = await Participant.findAll({
            where: {
                event_code: {
                    [Op.like]: 'SCHUSWCU1stAF_GraduatedTalkConcert%' 
                },
                user_id
            }
        });

        return results
    }catch(err){
        throw err
    }
}