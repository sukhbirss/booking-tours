class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = {...this.queryString};
		const excludeFields = ['page','sort','limit','fields'];
		excludeFields.forEach(el => delete queryObj[el]);
	//2) ADVANCE FILTERING---------------------------------------------------
		let queryStr = JSON.stringify(queryObj)
		queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g,match => `$${match}`);
		this.query.find(JSON.parse(queryStr));

		return this;
	// console.log(JSON.parse(queryStr));
	//let query = Tour.find(JSON.parse(queryStr));
	}
	
	sort() {
	//3 SORTING--------------------------------------------------------------
		if(this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy)
		} else {
		this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	limitFields() {
		//4 FIELD LIMITING
		if(this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields)
		} else {
			this.query = this.query.select('-__v');
		}

		return this;
	}

	peginate() {
		//5)PAGINATION
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1)* limit;

		this.query = this.query.skip(skip).limit(limit);
		
		return this;
	}
}

module.exports = APIFeatures;