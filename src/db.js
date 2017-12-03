let mongoose = require('mongoose')
mongoose.Promise = global.Promise // use native Promise
let mongoUri = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME
mongoose.connect(mongoUri, {useMongoClient: true}).then(
  (db) => {
    console.log('success connecting to : ', db.name)
  },
  (err) => {
    console.log('error', err)
  }
)
