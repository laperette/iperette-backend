var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    lowercase: true,
    unique: false,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: false
  },
  lastname: {
    type: String,
    lowercase: true,
    unique: false,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: false
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  color: String,
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  hash: String,
  salt: String
}, {
  timestamps: true
})

UserSchema.plugin(uniqueValidator, {
  message: 'is already taken.'
})

UserSchema.pre('save', function (next) {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  this.color = color
  console.log(this)
  next()
})

UserSchema.methods.validPassword = function (password) {
  console.log(this.salt)
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.generateJWT = function () {
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate() + 60)
  return jwt.sign({
    id: this._id,
    firstname: this.firstname,
    role: this.role,
    exp: parseInt(exp.getTime() / 1000)
  }, process.env.SECRET)
}

UserSchema.methods.toAuthJSON = function () {
  return {
    firstname: this.firstname,
    lastname: this.lastname,
    color: this.color,
    email: this.email,
    token: this.generateJWT()
  }
}

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    firstname: this.firstname,
    lastname: this.lastname,
    color: this.color
  }
}

mongoose.model('User', UserSchema)
module.exports = mongoose.model('User')
