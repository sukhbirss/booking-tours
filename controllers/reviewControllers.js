const Review = require('./../models/reviewModels');
const APIFeatures = require('./../util/apiFeatures');
const catchAsync = require('./../util/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req,res,next) => {
	
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Review.find(filter),req.query).filter().sort().limitFields().peginate();
	const reviews = await features.query;

	res.status(200).json({
	    status: 'success',
	     result:reviews.length,
	    data: {
	    		reviews
			}
		});

});
exports.deleteAllReviews = catchAsync(async (req,res,next) => {


    await Review.deleteMany();

	res.status(200).json({
	    status: 'success',
	    data: {
	    		data:null
			}
		});

});

exports.setTourUserIds = async (req,res,next) => {	

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();

};
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);