
module.exports = (sequelize, DataTypes) => {
    const drawnUser = sequelize.define(
        'drawnUser',
        {
        }
    )

    drawnUser.associate = (models) => {
        drawnUser.belongsTo(models.User, { foreignKey: 'user_id' })
    }
    return drawnUser;
}