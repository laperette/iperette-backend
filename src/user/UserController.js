const express = require('express')
let router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
  extended: true
}))
let User = require('./User')
const auth = require('../auth')

// CREATES A NEW USER
router.post('/', auth.optional, function (req, res) {
  User.create({
    firstname: req.body.user.firstname,
    lastname: req.body.user.lastname,
    email: req.body.user.email,
    phone: req.body.user.phone ? req.body.user.phone : ''
  }).then(
    user => {
      /* set hash and salt in database */
      user.setPassword(req.body.user.password)
      console.log('user salt : ', user.salt)
      user.save()
      /* get json representation of the user, with the jWT in it */
      let jsonUser = user.toAuthJSON()
      res.status(200).send(jsonUser)
    },
    err => {
      console.log(err)
      if (err.name == 'ValidationError') return res.status(400).send('Un compte existe déjà à cette adresse')
      return res.status(500).send(err)
    })
})

// LOGIN a USER
router.post('/login', auth.optional, function (req, res) {
  if (!req.body.user) return res.status(400).send('no user')
  User.find({
    email: req.body.user.email
  }).then(
    user => {
      console.log(user)
      if (user.length > 0 && user[0].validPassword(req.body.user.password)) {
        res.send(user[0].toAuthJSON())
      } else {
        res.status(401).send('Mot de passe erroné')
      }
    }, err => {
      res.status(500).send(err)
    }
  ).catch(err => {
    console.log(err)
    res.status(500).send(err)
  })
})

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', auth.required, function (req, res) {
  if (req.user && req.user.role != 'ADMIN') return res.sendStatus(401)
  User.find({}).populate('bookings').then(
    users => {
      let authJsonUsers = []
      users.forEach(usr => {
        authJsonUsers.push(usr.toAuthJSON())
      })
      console.log(authJsonUsers)
      res.status(200).send(authJsonUsers)
    }, err => {
      return res.status(500).send('There was a problem finding the users.')
    })
})

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', auth.required, function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(500).send('There was a problem finding the user.')
    if (!user) return res.status(404).send('No user found.')
    res.status(200).send(user)
  })
})

// DELETES A USER FROM THE DATABASE
router.delete('/:id', auth.required, function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(500).send('There was a problem deleting the user.')
    res.status(200).send('User ' + user.name + ' was deleted.')
  })
})

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', auth.required, function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, function (err, user) {
    if (err) return res.status(500).send('There was a problem updating the user.')
    res.status(200).send(user)
  })
})
module.exports = router
