const app = require('express');
const router = app.Router();
// const ctrl = require("../controllers/controllers")
const apiuser = require("./api-use")
// ctrl.post('/api/create-account', ctrl.createPaymentAccount);
// ctrl.get('/api/check-account', ctrl.checkAccount);
// ctrl.post('/api/payment', ctrl.postPayment);
// ctrl.get('/api/balance/:userId', ctrl.getUserBalance);
// ctrl.get('/', (req, res) => {
//     res.render('home', {
//         layout: false
//     });
// });
// module.exports = router;
module.exports = (app) => {
    app.use("/api", apiuser)
}
