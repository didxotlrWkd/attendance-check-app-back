const { RefreshTokenBlackList } = require("../../../database")


module.exports = async (refresh_token) => {
    try{
        const createdRefreshTokenBlackList = await RefreshTokenBlackList.create({ refresh_token })
        if(!createdRefreshTokenBlackList) return false
        return true
    } catch(err){
        console.error(err)
    }
}