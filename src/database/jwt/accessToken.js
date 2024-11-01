module.exports = (sequelize, DataTypes) => {
    const accessToken = sequelize.define('accessToken', {
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
        //unique
      }
    })
    accessToken.associate = (models) => {
      accessToken.belongsTo(models.User, { foreignKey: 'user_id' })
    }
    return accessToken
  }
  