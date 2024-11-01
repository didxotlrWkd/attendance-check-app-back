const {AccessTokenBlackList} = require('../../../../database')

module.exports = async(access_token) => {
    try{
        const is_token = await AccessTokenBlackList.findOne({
            where : {
                access_token
            }
        })

        if(is_token){
            return true
        }else{
            return false
        }
    }catch(err){
        throw err
    }
}