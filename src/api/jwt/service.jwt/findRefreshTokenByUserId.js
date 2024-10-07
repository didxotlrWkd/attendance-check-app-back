const { RefreshToken } = require('../../../database')

module.exports = async (user_id) => {
    try {
        const refresh_token = await RefreshToken.findOne({ where: { user_id: user_id } })
        if(!refresh_token) return false
        
        return refresh_token
    } catch (err) {
        console.error(err)
    }
}