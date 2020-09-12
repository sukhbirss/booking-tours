const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[ true, 'please tell your name']
	},
	email:{
		type:String,
		required:[ true, 'please enter your email'],
		unique:true,
		lowercase: true,
		validate:[validator.isEmail,'please enter your email']
	},
	photo:{
		type:String,
		default:'default.jpg'
	},
	role:{
		type:String,
		enum:['user','guide','lead-guide','admin'],
		default:'user'
	},
	password:{
		type:String,
		required:[ true, 'please enter your password'],
		minlength:0,
		select:false
	},
	passwordConfirm:{
		type:String,
		required:[ true, 'please confirm your password'],
		validate:{
			validator:function(el) {
				return el === this.password;
			},
			message: 'password are not same'
		}
	
	},
	passwordChangedAt: Date,
	passwordResetToken:String,
	passwordResetExpires:Date,
	active:{
		type:Boolean,
		default:true,
		select: false
	}
});
// To crypt the password
userSchema.pre('save', async function(next) {
	if(!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password,12)
	this.passwordConfirm = undefined;
  	next();
})

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//To verify password
userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
	console.log(await bcrypt.compare(candidatePassword, userPassword))
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
  	console.log(this.passwordChangedAt,JWTTimestamp);
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const User = mongoose.model('User',userSchema);

module.exports = User;
