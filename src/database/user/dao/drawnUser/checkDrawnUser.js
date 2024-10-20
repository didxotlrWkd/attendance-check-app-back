const {DrawnUser} = require('../../..')

module.exports = async() => {
    try{
        const drawnUserIds = await DrawnUser.findAll({
            attributes: ['user_id'],
        });

        const drawnIds = drawnUserIds.map(user => user.user_id); // ID 배열로 변환

        return drawnIds
    }catch(err) {
        throw err
    }
}