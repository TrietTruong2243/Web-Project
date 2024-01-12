require("dotenv").config();
const app = require('express');
const router = app.Router();
const appControl = require("../controllers/app.c");
router.get("/", appControl.homepage);
module.exports = router;