const router = require('express').Router();
const apiController = require('../controllers/api.c');

router.get('/balance/:userId', apiController.getUserBalance);
router.post('/create-account', apiController.postCreateAccount);
router.get('/check-account', apiController.getCheckAccount);
router.post('/payment', apiController.postPayment);

module.exports = router;
