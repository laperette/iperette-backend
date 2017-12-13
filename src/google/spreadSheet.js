const GoogleSpreadsheet = require('google-spreadsheet')
const async = require('async')

class SpreadSheet {
  constructor () {
    this.doc = new GoogleSpreadsheet(process.env.SHEET_ID)
    this.creds = require('../../' + process.env.GOOGLE_CREDENTIALS_NAME)
    this.sheet = null
    this._init()
  }

  _init () {
    console.log('init SpreadSheet connection')
    let self = this
    async.series([
      function setAuth (step) {
        self.doc.useServiceAccountAuth(self.creds, step)
      },
      function getInfoAndWorksheets (step) {
        self.doc.getInfo(function (err, info) {
          console.log('Loaded doc: ' + info.title + ' by ' + info.author.email)
          self.sheet = info.worksheets[0]
          console.log('sheet 1: ' + self.sheet.title + ' ' + self.sheet.rowCount + 'x' + self.sheet.colCount)
          step()
        })
      },
      function workingWithRows (step) {
        // google provides some query options 
        self.sheet.getRows({
          offset: 1,
          limit: 20,
          orderby: 'col2'
        }, function (err, rows) {
          if (!err) {
            self.dealWithTheRows(rows, step)
          }
        })
      }
    ])
  }
  dealWithTheRows (rows, step) {
    const User = require('../user/User')
    rows.forEach((row, i) => {
      User.find({
        email: row.email
      }, {
        '_id': 1
      }).limit(1).then(
        users => {
          if (users.length <= 0 && row.role == 'ADMIN') {
            User.create({
              firstname: row.firstname,
              lastname: row.lastname,
              email: row.email,
              phone: row.phone,
              role: row.role
            }).then(
              user => {
                user.setPassword(process.env.ADMIN_PASSW)
                user.save()
              }, err => {
                console.err('unable to save user when parsing spreadsheet', row.email)
              }
            )
          }
          // update the is_in_db row in spreadsheet
          row.is_in_db = 1
          row.save()
        },
        err => {
          console.log(err)
        }
      )
    })
    step()
  }
}
new SpreadSheet()
module.exports = SpreadSheet
