const { AccessToken } = require("../../../database");
const createAccessBlackList = require("./createAccessBlackList");

module.exports = async ({access_token, user_id}) => {
    try {
        const [save_access_token, isCreate] = await AccessToken.findOrCreate({
            where: { user_id },
            defaults: { access_token }
        });

        if (!save_access_token) {
            throw new Error('토큰 저장 중에 오류가 발생하였습니다.');
        }

        if (!isCreate) {
            const createdBlacklist = await createAccessBlackList(save_access_token.access_token);
            if (!createdBlacklist) {
                throw new Error('토큰 블랙리스트 생성 중 오류가 발생하였습니다.');
            }
            const deleted = await AccessToken.destroy({
                where: { user_id },
                force: true
            });

            if (deleted === 0) {
                throw new Error('토큰 삭제 중 오류가 발생하였습니다.');
            }
            const createdToken = await AccessToken.create({
                access_token,
                user_id
            });

            if (!createdToken) {
                throw new Error('토큰 업데이트 중 오류가 발생하였습니다.');
            }
        }

        return;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
