const express = require('express')
let router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
  extended: true
}))
let Booking = require('./Booking')
let User = require('../user/User')

const auth = require('../auth')

// CREATES A NEW BOOKING  
router.post('/', auth.required, function (req, res) {
  Booking.create({
    start: req.body.start,
    end: req.body.end,
    numOfParticipants: req.body.numOfParticipants,
    booker: req.user.id
  }).then(booking => {
    User.update(
      { _id: booking.booker },
      { $push: { bookings: booking._id } }
    ).then(user => {
      console.log(modif)
      res.status(200).send(booking)
    }, err => {
      console.log(err)
      return res.status(500).send('There was a problem adding the information to the database.')
    })
  }, err => {
    console.log(err)
    return res.status(500).send('There was a problem adding the information to the database.')
  })
})

// RETURNS ALL THE BOOKINGS IN THE DATABASE
router.get('/', function (req, res) {
  Booking.find({}, function (err, bookings) {
    if (err) return res.status(500).send('There was a problem finding the bookings.')
    res.status(200).send(bookings)
  })
})

// GETS A SINGLE BOOKING FROM THE DATABASE
router.get('/:id', function (req, res) {
  Bookings.findById(req.params.id, function (err, booking) {
    if (err) return res.status(500).send('There was a problem finding the booking.')
    if (!booking) return res.status(404).send('No booking found.')
    res.status(200).send(booking)
  })
})

// DELETES A BOOKING FROM THE DATABASE
router.delete('/:id', function (req, res) {
  Booking.findByIdAndRemove(req.params.id, function (err, booking) {
    if (err) return res.status(500).send('There was a problem deleting the booking.')
    res.status(200).send('Booking ' + booking._id + ' was deleted.')
  })
})

// UPDATES A SINGLE BOOKING IN THE DATABASE
router.put('/:id', function (req, res) {
  Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, function (err, booking) {
    if (err) return res.status(500).send('There was a problem updating the booking.')
    res.status(200).send(booking)
  })
})
module.exports = router
