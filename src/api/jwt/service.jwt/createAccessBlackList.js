const { AccessTokenBlackList } = require("../../../database");

module.exports = async (access_token) => {
    try {
        const createAccessTokenBlackList = await AccessTokenBlackList.create({ access_token });
        return !!createAccessTokenBlackList;
    } catch (err) {
        console.error(err);
        return false;
    }
}