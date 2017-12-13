let mongoose = require('mongoose')
mongoose.Promise = global.Promise // use native Promise
const mongoUri = process.env.DB_CONNECTION_URI
mongoose.connect(mongoUri, { useMongoClient: true }).then(
  (db) => {
    console.log('success connecting to : ', db.name)
  },
  (err) => {
    console.log('error', err)
  }
)
