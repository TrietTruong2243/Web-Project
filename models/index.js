const sequelize = require('../config/db');

const db = {};

db.sequelize = sequelize;
db.Account = require('./account.m')(sequelize);
db.PaymentHistory = require('./payment-history.m')(sequelize);

// associations
// Account - PaymentHistory
db.Account.hasMany(db.PaymentHistory, {
    foreignKey: {
        name: 'accountId',
        allowNull: false,
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});
db.PaymentHistory.belongsTo(db.Account, {
    foreignKey: 'accountId',
});

module.exports = db;