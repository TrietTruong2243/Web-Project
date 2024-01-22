const router = require('express').Router();
const OrderController = require('../controllers/order.c.js');

router.get('/create-new', OrderController.getCreateOrder);
router.post('/multi-action', OrderController.handleMultiItems);
router.get('/edit/:id', OrderController.getEditOrder);
router.post('/edit/:id', OrderController.postEditOrder);
router.post('/:id', OrderController.handleSingleItem);
router.get('/', OrderController.showAll);
router.post('/', OrderController.createOrder);

module.exports = router;