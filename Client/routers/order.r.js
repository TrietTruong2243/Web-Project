require("dotenv").config();
const app = require('express');
const router = app.Router();
const mws = require("../mws/middlewareController")
const orderControl = require("../controllers/order.c");
const { check } = require('express-validator');
router.use(app.static(__dirname+'/../public'));

router.get("/getorderdetail",mws.verifyToken, orderControl.getOrderDetail);
router.get("/orderdetail",mws.verifyToken, orderControl.OrderDetail);
router.get("/updatestatus",mws.verifyToken, orderControl.StatusUpdate);
module.exports = router;