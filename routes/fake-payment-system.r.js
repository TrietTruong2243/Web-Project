const fakePaymentSystemRoute = require('express').Router();
const fakePaymentSystemController = require('../controllers/fake-payment-system.c');

fakePaymentSystemRoute.get(
	'/checkout',
	fakePaymentSystemController.getPaymentCheckout
);

fakePaymentSystemRoute.post(
	'/checkout',
	fakePaymentSystemController.postPaymentCheckout
);

module.exports = fakePaymentSystemRoute;
