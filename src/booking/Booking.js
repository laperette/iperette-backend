let mongoose = require('mongoose'),
  uniqueValidator = require('mongoose-unique-validator'),
  User = mongoose.model('User'),
  moment = require('moment')

var BookingSchema = new mongoose.Schema({
  start: {
    type: mongoose.Schema.Types.Date,
    required: [true, "can't be blank"]
  },
  end: {
    type: mongoose.Schema.Types.Date,
    required: [true, "can't be blank"]
  },
  pending: {
    type: Boolean,
    default: true
  },
  numOfParticipants: {
    min: 1,
    max: 50,
    type: Number,
    required: [true, "can't be blank"]
  },
  booker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "can't be blank"]
  }
}, {
  timestamps: true
})

BookingSchema.plugin(uniqueValidator, {
  message: 'is already taken'
})

BookingSchema.pre('save', function (next) {
  if (moment(this.start).isAfter(this.end)) {
    next(new Error('start must be before the end'))
  }
  mongoose.model('Booking').find({
    $or: [{
      'start': {
        $gte: this.start,
        $lte: this.end
      }
    },
      {
        'end': {
          $gte: this.start,
          $lte: this.end
        }
      }
    ]
  }, { '_id': 1 }).populate('booker', 'firstname lastname')
    .then(bookings => {
      if (bookings.length > 0) {
        let booker = bookings[0].booker
        let msg = bookings[0].booker.firstname + ' ' + bookings[0].booker.lastname + ' a déjà reservé à ces dates'
        next(new Error(msg))
      } else {
        next()
      }
    })
    .catch(reason => {
      next(new Error('error verifying the validity of the booking'))
    })
})

BookingSchema.methods.toJSONFor = function (user) {
  return {
    start: this.start,
    end: this.end,
    pending: this.pending,
    numOfParticipants: this.numOfParticipants,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    booker: this.booker.toProfileJSONFor(user)
  }
}

mongoose.model('Booking', BookingSchema)
module.exports = mongoose.model('Booking')
