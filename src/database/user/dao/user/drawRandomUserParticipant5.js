const { User , sequelize, Sequelize} = require('../../../../database')

module.exports = async ({ drawn_ids }) => {
    try {
        const users = await User.findOne({
            where: {
                participant_count: 5,
                id: {
                    [Sequelize.Op.notIn]: drawn_ids
                }
            },
            order: sequelize.random(),
        });

        return users
    } catch (err) {
        throw err
    }
}