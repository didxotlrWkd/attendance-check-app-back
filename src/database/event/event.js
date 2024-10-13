
module.exports = (sequelize, DataTypes) => {
    const event = sequelize.define(
        'event',
        {
            event_code : {
                type : DataTypes.STRING,
                allowNull : false,
                unique : true,
                primaryKey : true,
            },

            event_name : {
                type : DataTypes.STRING,
                allowNull : false,
                unique : true
            },
            
            location : {
                type : DataTypes.STRING,
                allowNull : false
            },

            event_time : {
                type : DataTypes.DATE,
                allowNull : false,
            }
        },
    )

    event.associate = (models) => {
        event.hasMany(models.Participant, { foreignKey: 'event_code' })
    }   
    return event;
}