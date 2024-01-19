require("dotenv").config();
const app = require('express');
const router = app.Router();
const mws = require("../mws/middlewareController")
const userControl = require("../controllers/user.c")
router.get("/accountsettings",mws.verifyToken, userControl.accountsettings)
module.exports = router;