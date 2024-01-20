require("dotenv").config();
const app = require('express');
const router = app.Router();
const appControl = require("../controllers/app.c");
router.get("/", appControl.homepage);
router.get("/getallcategories",appControl.getAllCategories)
router.get("/getallpagebycategory",appControl.getAllPageByCategory)
router.get("/getproductbypage", appControl.getProductByPage);
router.get("/viewproduct", appControl.viewProduct)
router.get("/search", appControl.search)
router.get("/getsearchproduct", appControl.searchProduct)
router.get("/getfindproductbypage",appControl.getFindProductByPage)
router.get("/getallpagebyfilter",appControl.getAllPageByFilter)
module.exports = router;