module.exports = (sequelize, DataTypes) => {
    const accessTokenBlackList = sequelize.define('accessTokenBlackList', {
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    })
    accessTokenBlackList.associate = (models) => {
    }
    return accessTokenBlackList
  }
  