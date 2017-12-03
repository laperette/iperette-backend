var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/iperette', {useMongoClient: true}).then(
  (db) => {
    console.log('success connecting to : ', db.name)
  },
  (err) => {
    console.log('error', err)
  }
)
