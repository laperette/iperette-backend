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
    type: Number,
    required: [true, "can't be blank"]
  },
  booker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    'booker': this.booker,
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
  }, {'_id': 1}).exec((err, bookings) => {
    if (bookings.length > 0) {
      next(new Error('booking dates are in conflict with other bookings you have'))
    } else {
      next()
    }
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