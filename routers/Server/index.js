const AuthMiddleware = require('../../middlewares/auth');
const AuthRouter = require('./auth.r');
const MeRouter = require('./me.r');
const AdminRouter = require('./admin.r');
const CustomerRouter = require('./customer.r');
const CategoryRouter = require('./category.r');
const ProductRouter = require('./product.r');
const OrderRouter = require('./order.r');
const StatisticRouter = require('./statistic.r');

module.exports = (app) => {
    app.use('/admin/', AuthRouter);
    app.use('/admin/*', AuthMiddleware);
    app.use('/admin/me', MeRouter);
    app.use('/admin/admin', AdminRouter);
    app.use('/admin/customer', CustomerRouter);
    app.use('/admin/category', CategoryRouter);
    app.use('/admin/product', ProductRouter);
    app.use('/admin/order', OrderRouter);
    app.use('/admin/statistic', StatisticRouter);

}