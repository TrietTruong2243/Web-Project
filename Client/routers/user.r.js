require("dotenv").config();
const userControl = require("../controllers/user.c")
const app = require('express');
const router = app.Router();
const mws = require("../mws/middlewareController")
router.get("/accountsettings",mws.verifyToken, userControl.accountsettings)
module.exports = router;