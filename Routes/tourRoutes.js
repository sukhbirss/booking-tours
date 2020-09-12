const express = require('express');

const tourControllers = require('./../controllers/tourControllers');
const authControllers = require('./../controllers/authControllers');
const reviewControllers = require('./../controllers/reviewControllers');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id',tourControllers.checkID);
router.use('/:tourId/reviews', reviewRouter);

router
	.route('/top-5-cheap')
	.get(tourControllers.aliasTopTours,tourControllers.getAllTours);
router
	.route('/tour-stats')
	.get(tourControllers.getTourStats);
router
	.route('/monthly-plan/:year')
	.get(authControllers.protect,authControllers.restrictTo('admin','lead-guide','guides'),tourControllers.getMonthlyPlan);
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourControllers.getToursWithin);

router
	.route('/distances/:latlng/unit/:unit')
	.get(tourControllers.getDistances);

router
	.route('/')
	.get(tourControllers.getAllTours)
	.post(authControllers.protect,authControllers.restrictTo('admin','lead-guide'),tourControllers.createTour);
router
	.route('/:id')
	.get(tourControllers.getTour)
	.patch(authControllers.protect,authControllers.restrictTo('admin','lead-guide'),
	 		tourControllers.uploadTourImages,tourControllers.resizeTourImages,tourControllers.updateTour)

	.delete(authControllers.protect,authControllers.restrictTo('admin','lead-guide'),tourControllers.deleteTour);

module.exports = router;