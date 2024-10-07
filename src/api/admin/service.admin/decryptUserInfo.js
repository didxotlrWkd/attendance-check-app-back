const { decrypt, encrypt } = require("../../../utils/crypt");


module.exports = async (encrypt_user_info) => {
    try{
        const decrypt_user_info= await Promise.all(
            encrypt_user_info.map(async (user) => {
                const decrypt_student_code = decrypt(user.student_code);
                const decrypt_name = decrypt(user.name);
                return {
                    ...user.toJSON(),
                    student_code: decrypt_student_code,
                    name: decrypt_name,
                };
            })
        );

        return decrypt_user_info
    }catch(err){
        throw err
    }
}