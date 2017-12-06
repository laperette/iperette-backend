var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express()
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
var db = require('./db') // connect to db
var UserController = require('./user/UserController')
app.use('/users', UserController)

var BookingController = require('./booking/BookingController')
app.use('/bookings', BookingController)

module.exports = app
