require("dotenv").config();
const app = require('express');
const router = app.Router();
const appControl = require("../controllers/app.c");
router.get("/", appControl.homepage);
router.get("/getallcategories",appControl.getAllCategories)
router.get("/getallpagebycategory",appControl.getAllPageByCategory)
router.get("/getproductbypage", appControl.getProductByPage);
router.get("/viewproduct", appControl.viewProduct)
module.exports = router;