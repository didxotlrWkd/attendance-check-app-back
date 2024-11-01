const { AccessTokenBlackList, sequelize } = require("../../../database");

module.exports = async (access_token) => {
    const transaction = await sequelize.transaction();

    try {
        const createAccessTokenBlackList = await AccessTokenBlackList.create(
            { access_token },
            { transaction }
        );
        await transaction.commit(); // 성공 시 커밋
        return !!createAccessTokenBlackList;
    } catch (err) {
        await transaction.rollback(); // 오류 발생 시 롤백
        console.error(err);
        return false;
    }
}
