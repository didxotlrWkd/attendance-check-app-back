const {User} = require("../../../../database")

module.exports = async({student_code}) => {
    try{
        const user = await User.findOne(
            {
                where : {
                    student_code
                }
            }
        )

        return user
    } catch(err) {
        throw err
    }
}