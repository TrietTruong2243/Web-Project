const router = require('express').Router();
const apiController = require('../controllers/api.c');

// router.get('/payment-limit', apiController.getPaymentLimit);
router.get('/balance/:userId', apiController.getUserBalance);

router.post('/create-account', apiController.postCreateAccount);
router.post('/payment', apiController.postPayment);

// router.put('/minium-limit', apiController.putUpdatePaymentLimit);

module.exports = router;
