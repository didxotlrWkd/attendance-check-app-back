const { RefreshToken } = require('../../../database')

module.exports = async (refresh_token, user_id) => {
    try {
        const check_refresh_token = await RefreshToken.findOne({ where: { user_id }})

        if(check_refresh_token.refresh_token == refresh_token) return true
        return false
    } catch (err) {
        console.error(err)
    }
}