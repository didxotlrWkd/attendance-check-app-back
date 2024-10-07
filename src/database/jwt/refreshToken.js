module.exports = (sequelize, DataTypes) => {
    const refreshToken = sequelize.define('refreshToken', {
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
        //unique
      }
    })
    refreshToken.associate = (models) => {
      refreshToken.belongsTo(models.User, { foreignKey: 'user_id' })
    }
    return refreshToken
  }
  