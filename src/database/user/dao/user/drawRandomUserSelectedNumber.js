const { User , sequelize, Sequelize} = require('../../../../database')

module.exports = async ({ participant_count, number_of_draw }) => {
    try {
        const users = await User.findAll({
            where: {
                participant_count: {
                    [Sequelize.Op.gte]: participant_count
                }
            },
            order: sequelize.random(),
            limit: number_of_draw
        });

        return users
    } catch (err) {
        throw err
    }
}