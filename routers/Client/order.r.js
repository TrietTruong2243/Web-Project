require("dotenv").config();
const app = require('express');
const router = app.Router();
const mws = require("../../mws/Client/middlewareController")
const orderControl = require("../../controllers/Client/order.c");
const { check } = require('express-validator');
router.use(app.static(__dirname+'/../public'));

router.get("/getorderdetail",mws.verifyToken, orderControl.getOrderDetail);
router.get("/orderdetail",mws.verifyToken, orderControl.OrderDetail);
module.exports = router;