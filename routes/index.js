const AuthMiddleware = require('../middlewares/auth');
const AuthRouter = require('./auth.r');
const MeRouter = require('./me.r');
const AdminRouter = require('./admin.r');
const CustomerRouter = require('./customer.r');
const CategoryRouter = require('./category.r');
const ProductRouter = require('./product.r');
const OrderRouter = require('./order.r');
const StatisticRouter = require('./statistic.r');

module.exports = (app) => {
    app.use('/', AuthRouter);
    app.use('/*', AuthMiddleware);
    app.use('/me', MeRouter);
    app.use('/admin', AdminRouter);
    app.use('/customer', CustomerRouter);
    app.use('/category', CategoryRouter);
    app.use('/product', ProductRouter);
    app.use('/order', OrderRouter);
    app.use('/statistic', StatisticRouter);
}