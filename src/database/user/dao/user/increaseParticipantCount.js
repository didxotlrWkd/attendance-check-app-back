const { User } = require('../../../../database')
module.exports = async (id) => {
    try {
        const user = await User.findByPk(id);
        await user.increment('participant_count');
        return user
    } catch (err) {
        throw err
    }
}