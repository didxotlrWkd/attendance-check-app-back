const {User} = require("../../../../database")

module.exports = async({student_code, name, major}) => {
    try{
        const user = await User.findOne(
            {
                where : {
                    student_code,
                    name,
                    major,
                }
            }
        )

        return user
    } catch(err) {
        throw err
    }
}