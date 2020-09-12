const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({path: './config.env'});

const app = require('./app');
const DB = process.env.DATABASE;
mongoose.connect(DB, {
	userNewUrlParser: true,
	useCreateIndex: true,
	userFindAndModify:false
})
  .then(() => console.log('dB connection successfull'));



const port = process.env.PORT || 3000;
const server = app.listen(port,() => {
	console.log(`app running on port:-${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});