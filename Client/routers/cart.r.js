require("dotenv").config();
const app = require('express');
const router = app.Router();
const cartControl = require("../controllers/cart.c");
const mws = require("../mws/middlewareController")
router.use(app.static(__dirname+'/../public'));
router.get("/",mws.verifyToken, cartControl.cartview);
router.post("/addtocart",mws.verifyToken, cartControl.addToCart);
router.get("/getcartinfo",mws.verifyToken, cartControl.getCartInfo);
router.get("/changecartquantity",mws.verifyToken, cartControl.changeCartQuantity)
router.get("/removeitem",mws.verifyToken, cartControl.removeCartItem)
module.exports = router;
