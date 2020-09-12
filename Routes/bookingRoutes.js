const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authControllers = require('./../controllers/authControllers');

const router = express.Router();

router.use(authControllers.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

module.exports = router;
