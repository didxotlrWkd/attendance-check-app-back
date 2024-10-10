const {User} = require('../../../database')

module.exports =  async(user_id) => {
    try{
        const user = await User.findOne({
            where : {
                id : user_id
            }
        })
        if(user){
            user.destroy()
        } else{
            throw new Error('없는 사용자입니다.')
        }
        return

    } catch(err){
        throw err
    }
}