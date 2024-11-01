const {User} = require("../../../../database")

module.exports = async({major , student_code , name , password}) => {
    try{
        const user = await User.create({
            major,
            student_code,
            name,
            password
        })

        return user
    } catch(err) {
        console.error(err)
        throw err
    }
}