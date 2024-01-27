const router = require('express').Router();
const StatisticController = require('../controllers/statistic.c.js');

router.get('/api/top-selling-products', StatisticController.showTopSelling);
router.get('/api/sale-distributed-by-category', StatisticController.showByCategory);
router.get('/api/sale-distributed-by-month', StatisticController.showInYear);
router.get('/api/sale-by-period', StatisticController.showByPeriod);
router.get('/api/operation-years', StatisticController.showYears);
router.get('/api/recent-orders', StatisticController.showRecentOrders);
router.get('/api/overview', StatisticController.showOverview);

module.exports = router;