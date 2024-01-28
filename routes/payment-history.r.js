const paymentHistoryRoute = require('express').Router();
const paymentHistoryController = require('../controllers/payment-history.c');

paymentHistoryRoute.get('/', paymentHistoryController.getPaymentHistory);

module.exports = paymentHistoryRoute;
