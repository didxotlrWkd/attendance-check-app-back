const {DrawnUser} = require('../../..')

module.exports = async(user_id)=> {
    try{
        await DrawnUser.create({
            user_id
        })
    }catch(err){
        throw err
    }
}