const {User} = require('../../../database')
const participant = require('../../participant/participant')

module.exports = async(id) => {
    try{
        const user = await User.findOne({
            where : {
                id 
            }
        })

        await user.update({participant_count : user.participant_count + 1})

        return user
    }catch(err) {
        throw err
    }
}