var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

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
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  color: String,
  bio: String,
  image: String,
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
  next()
})

mongoose.model('User', UserSchema)
module.exports = mongoose.model('User')
