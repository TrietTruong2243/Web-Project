const dashboardRoute = require('express').Router();
const dashboardController = require('../controllers/dashboard.c');

dashboardRoute.get('/', dashboardController.getDashboardPage);

module.exports = dashboardRoute;
