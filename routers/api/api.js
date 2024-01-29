const app = require('express');
const router = app.Router();
const apiuser = require("./api-use")

module.exports = (app) => {
    app.use("/api", apiuser)
}
