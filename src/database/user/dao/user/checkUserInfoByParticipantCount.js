const { User } = require('../../../../database')

module.exports = async () => {
    try {
        const users = await User.findAll(
            {
                order: [['participant_count', 'DESC']]
            }
        )
        
        return users
    }catch(err){
        throw err
    }
}