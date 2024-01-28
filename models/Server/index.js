const sequelize = require('../../config/db');
const db = {};
db.sequelize = sequelize;
db.User = require('./user.m')(sequelize);
db.Category = require('./category.m')(sequelize);
db.Product = require('./product.m')(sequelize);
db.Image = require('./image.m')(sequelize);
db.Order = require('./order.m')(sequelize);
db.OrderItem = require('./orderItem.m')(sequelize);
db.CartItem = require('./cartItem.m')(sequelize);

// associations
// User - Image
db.User.hasOne(db.Image, { as: 'image', foreignKey: 'userId' });
db.Image.belongsTo(db.User, { as: 'user', foreignKey: 'userId' });
// Product - Image
db.Product.hasMany(db.Image, { as: 'images', foreignKey: 'productId' });
db.Image.belongsTo(db.Product, { foreignKey: 'productId' });
// Product - mainImage
db.Product.belongsTo(db.Image, { as: 'mainImage', foreignKey: 'mainImageId', constraints: false });
// Category - Product
db.Category.hasMany(db.Product, { as: 'products', foreignKey: 'categoryId' });
db.Product.belongsTo(db.Category, { as: 'category', foreignKey: 'categoryId' });
// Order - User
db.User.hasMany(db.Order, { as: 'orders', foreignKey: 'userId' });
db.Order.belongsTo(db.User, { as: 'user', foreignKey: 'userId' });
// Order - OrderItem
db.Order.hasMany(db.OrderItem, { as: 'orderItems', foreignKey: 'orderId', onDelete: 'cascade' });
db.OrderItem.belongsTo(db.Order, { as: 'order', foreignKey: 'orderId' });
// OrderItem - Product
db.Product.hasMany(db.OrderItem, { as: 'orderItems', foreignKey: 'productId', onDelete: 'cascade' });
db.OrderItem.belongsTo(db.Product, { as: 'product', foreignKey: 'productId' });
// CartItem - Product
db.Product.hasMany(db.CartItem, { as: 'cartItems', foreignKey: 'productId' });
db.CartItem.belongsTo(db.Product, { foreignKey: 'productId' });
// CartItem - User
db.User.hasMany(db.CartItem, { as: 'cartItems', foreignKey: 'userId' });
db.CartItem.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;