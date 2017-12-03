var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))

var db = require('./db') // connect to db
var UserController = require('./user/UserController')
app.use('/users', UserController)

module.exports = app
