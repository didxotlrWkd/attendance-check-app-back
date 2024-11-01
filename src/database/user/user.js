
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        'user',
        {
            student_code : {
                type : DataTypes.STRING,
                allowNull : false,
                unique : true,
            },

            major: {
                type : DataTypes.STRING,
                allowNull : false,
            },

            name : {
                type : DataTypes.STRING,
                allowNull: false,
            },

            password: {
                type : DataTypes.STRING,
                allowNull: false,
            },

            participant_count : {
                type : DataTypes.INTEGER,
                allowNull : false,
                defaultValue : 0
            }
        },
        {
            paranoid: true,
        }

    )

    user.associate = (models) => {
        user.hasMany(models.Participant, { foreignKey: 'user_id' })
        user.hasMany(models.RefreshToken,{ foreignKey: 'user_id'})
        user.hasMany(models.DrawnUser,{ foreignKey: 'user_id'})
        user.hasMany(models.AccessToken,{ foreignKey: 'user_id'})
    }
    return user;
}