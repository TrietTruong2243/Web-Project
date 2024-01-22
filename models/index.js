const sequelize = require('../config/db');

const db = {};

db.sequelize = sequelize;
db.User = require('./user.m')(sequelize);
db.Category = require('./category.m')(sequelize);
db.Product = require('./product.m')(sequelize);
db.Image = require('./image.m')(sequelize);
db.Order = require('./order.m')(sequelize);
db.OrderItem = require('./orderItem.m')(sequelize);
db.CartItem = require('./cartItem.m')(sequelize);

module.exports = db;