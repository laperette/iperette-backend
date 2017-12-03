var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
var Booking = require('./Booking')

// CREATES A NEW BOOKING  
router.post('/', function (req, res) {
  Booking.create({
    start: req.body.start,
    end: req.body.end
  },
    function (err, booking) {
      if (err) return res.status(500).send('There was a problem adding the information to the database.')
      res.status(200).send(booking)
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
  Booking.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, booking) {
    if (err) return res.status(500).send('There was a problem updating the booking.')
    res.status(200).send(booking)
  })
})
module.exports = router
