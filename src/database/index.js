require('dotenv').config();
const Sequelize = require('sequelize');
const db = {};

const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASW,
    database: process.env.NODE_ENV === 'production' ? process.env.DB_BASE_PRODUCTION : process.env.DB_BASE_DEVELOP,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+09:00', // 한국 시간 "asia/seoul"
    define: {
        underscored: false,
        freezeTableName: false,
        charset: 'utf8',
        collate: "utf8_general_ci",
        timestamps: true,
        paranoid: false,
        createdAt: true,
        updatedAt: false,
    },
    logging: (msg) => {
        if (msg.includes('ERROR')) {
            console.error(msg); // 에러 메시지만 출력
        }
    },
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// user
db.User = require('./user/user')(sequelize, Sequelize);
db.Event = require('./event/event')(sequelize, Sequelize);
db.Participant = require('./participant/participant')(sequelize, Sequelize);
db.DrawnUser = require('./user/drawnUser')(sequelize, Sequelize);

// jwt
db.RefreshToken = require('./jwt/refreshToken')(sequelize, Sequelize);
db.RefreshTokenBlackList = require('./jwt/refreshTokenBlackList')(sequelize, Sequelize);
db.AccessToken = require('./jwt/accessToken')(sequelize, Sequelize);
db.AccessTokenBlackList = require('./jwt/accessTokenBlackList')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
