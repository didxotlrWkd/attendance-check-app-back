const { User } = require('../../../database')

module.exports = async (user_id) => {
    try {
        const user = await User.findOne({
            where: {
                id : user_id
            }
        }
        )

        return user
    } catch (err) {
        throw err
    }


}