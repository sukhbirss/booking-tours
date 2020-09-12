const path = require('path');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter =  require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const bookingRouter = require('./routes/bookingRoutes');

const app =express();


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Set security HTTP headers
app.use(helmet());

//Middlewares.............
if(process.env.NODE_ENV === 'devlopment') {
	app.use(morgan('dev'));
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60*60*1000,
	message: 'To many request from this ip,please try again  in an hour!'
});

app.use('/api',limiter);

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
//cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//overview vgera dekhn lyi
app.use(express.static(`${__dirname}/public`));


// app.get('/',(req,res) => {
// 	res.status(200).send('hello from server side');
// });
app.use((req,res,next) => {
	console.log("hello from the middleware............................");


	next();
});

app.use((req,res,next) => {
	req.requestTime = new Date().toISOString();
	next();
});




//app.get('/api/v1/tours',getAllTours);
//snippet to get data of specific id..................
//app.get('/api/v1/tours/:id',getTour);
//To see data from tours json file....................
//app.post('/api/v1/tours',createTour);
//patch...............................................
//app.patch('/api/v1/tours/:id',updatetour);
//delete..............................................
//app.delete('/api/v1/tours/:id',deleteTour);


//Routes.......

app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*',(req,res,next) => {
	res.status(404).json({
		status:'fail',
		message:`can't find ${req.originalUrl} on the server!`
	});
});

app.all('*',(req,res,next) => {

	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);
module.exports = app;