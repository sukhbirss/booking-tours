const fs = require('fs');
const Tour = require('./../../models/tourModels');
const User = require('./../../models/userModels');
const Review = require('./../../models/reviewModels');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './../../config.env'});
const DB = process.env.DATABASE;

mongoose.connect(DB, {
	userNewUrlParser: true,
	useCreateIndex: true,
	userFindAndModify:false
})
  .then(() => console.log('dB connection successfull'));



//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));


//IMPORT DATA INTO DB
const importData = async () => {
	try{

		await Tour.create(tours);

		console.log('Data successfully loaded')
		process.exit();

	}catch(err) {

		console.log(err)

	}
	process.exit();
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
		try{
		await Tour.deleteMany();

		console.log('Data successfully deleted')
		process.exit();
	}catch(err) {
		console.log(err)
	}
	process.exit();
}

if(process.argv[2] === '--import'){
	importData()
} else if(process.argv[2] === '--delete'){
	deleteData();
}

console.log(process.argv);