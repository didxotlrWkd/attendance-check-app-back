const {User} = require("../../../database")

module.exports = async({major , student_code , name}) => {
    try{
        const user = await User.create({
            major,
            student_code,
            name
        })

        return user
    } catch(err) {
        console.error(err)
        throw err
    }
}