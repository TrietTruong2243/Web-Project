require("dotenv").config();
const app = require('express');
const router = app.Router();
const mws = require("../mws/middlewareController")
const userControl = require("../controllers/order.c");
const { check } = require('express-validator');
router.use(app.static(__dirname+'/../public'));


module.exports = router;