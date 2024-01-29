require('dotenv').config()
const app = require('express');
const router = app.Router();
const ctrl = require("../../controllers/api/controllers")
router.get('/create-account', ctrl.createPaymentAccount);
router.get('/check-account', ctrl.checkAccount);
router.post('/payment', ctrl.postPayment);
router.get('/balance/:userId', ctrl.getUserBalance);
router.get('/', (req, res) => {
    res.render('home', {
        layout: false
    });
});
module.exports = router;
