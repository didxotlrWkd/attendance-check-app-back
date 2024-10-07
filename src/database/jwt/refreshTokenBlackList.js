module.exports = (sequelize, DataTypes) => {
  const refreshTokenBlackList = sequelize.define('refreshTokenBlackList', {
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
  refreshTokenBlackList.associate = (models) => {
  }
  return refreshTokenBlackList
}
