const router = require('express').Router();
const OrderController = require('../controllers/order.c.js');

router.get('/create-new', OrderController.getCreateOrder);
router.post('/multi-action', OrderController.handleMultiItems);
router.get('/edit/:id', OrderController.getEditOrder);
router.post('/:id', OrderController.handleSingleItem);
router.get('/', OrderController.showAll);

// api
router.get('/api/data/:id', OrderController.getOrderData);
router.patch('/api/change-status/:id', OrderController.changeStatus);
router.post('/api/create-new', OrderController.createNewOrder);
router.patch('/api/edit/:id', OrderController.editOrder);

module.exports = router;