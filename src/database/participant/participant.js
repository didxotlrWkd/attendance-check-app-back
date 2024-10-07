
module.exports = (sequelize, DataTypes) => {
    const participant = sequelize.define(
        'participant', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
        }
    )

    participant.associate = (models) => {
        participant.belongsTo(models.User, {foreignKey : 'user_id'})
        participant.belongsTo(models.Event , {foreignKey : "event_code"})
    }
    return participant;
}