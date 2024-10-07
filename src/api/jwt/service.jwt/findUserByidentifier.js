const { User } = require('../../../database')

module.exports = async (oauth_id, oauth_type) => {
    try {
        const user = await User.findOne({ where: { oauth_id: oauth_id, oauth_type: oauth_type }, paranoid: false })
        if(!user) return false
        return user
    } catch (err) {
        console.error(err)
    }
}