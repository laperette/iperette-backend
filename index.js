var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080

app.route('*').get((req, res) => {
  res.send('Hello World')
})

app.listen(port)

console.log('iPerette RESTful API server started on: ' + port)
