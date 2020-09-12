const Tour = require('./../models/tourModels');
const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/appError');

exports.getOverview = catchAsync(async (req,res) => {
	//getting the tour data
	const tours = await Tour.find();

	//bulid template
	//render that template using data from 1
	res.status(200).render('overview',{
		title:'All Tours',
		tours
	});
});

exports.getTour = catchAsync(async (req,res,next) => {
  console.log("1")

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  
  console.log("2")
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }


	res.status(200).render('tour',{
		title: `${tour.name} Tour`,
		tour
	});
});

exports.getLoginForm = (req, res) => {
  res.status(201).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Join us'
  });
};

exports.getAccount = (req, res) => {

  res.status(200).render('account', {
    title: 'My Account'
  });
};
