const { RefreshTokenBlackList } = require("../../../database")


module.exports = async (refresh_token) => {
    try{
        const check_refresh_blackList = await RefreshTokenBlackList.findOne({ where: { refresh_token } })
        if(!check_refresh_blackList) return false
        return true
    } catch(err){
        console.error(err)
    }
}