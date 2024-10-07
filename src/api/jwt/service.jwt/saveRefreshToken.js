const { RefreshToken } = require("../../../database")
const createRefreshBlackList = require("./createRefreshBlackList")


module.exports = async (refresh_token, user_id) => {
    try {
        const [save_refresh_token, isCreate] = await RefreshToken.findOrCreate({ where: { user_id }, defaults: { refresh_token: refresh_token }})
        if(!save_refresh_token) throw new Error('토큰 저장 중에 오류가 발생하였습니다.')

        if(!isCreate){
            // refresh blacklist에 추가
            const createdBlacklist = await createRefreshBlackList(save_refresh_token.refresh_token)
            if(!createdBlacklist) throw new Error('토큰 블랙리스트 생성 중 오류가 발생하였습니다.')
            const deleted = await RefreshToken.destroy({ where: { user_id }, force: true })
            if(!deleted) throw new Error('토큰 삭제 중 오류가 발생하였습니다.')
            const createdToken = await RefreshToken.create({ refresh_token, user_id })
            if(!createdToken) throw new Error('토큰 업데이트 중 오류가 발생하였습니다.')
        }

        return
    } catch(err) {
        console.error(err)
    }
}