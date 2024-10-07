require('dotenv').config();
const crypto = require('crypto');

const env = process.env;
const key = crypto.scryptSync(env.CRYPT_KEY, 'specialSalt', 32);
const algorithm = env.CRYPT_ALGORITHM; 
const iv = env.CRYPT_IV


const encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let result = cipher.update(data, 'utf8', 'hex');
  result += cipher.final('hex');

  return result;
};

const decrypt = (data) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let result = decipher.update(data, 'hex', 'utf8'); 
  result += decipher.final('utf8'); 

  return result;
};

module.exports = {
  encrypt,
  decrypt
};
