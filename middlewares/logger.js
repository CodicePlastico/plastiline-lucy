const winston = require('winston')

function logger(req, res, next) {
  req.logger = res.logger = winston
  next()
}

module.exports = logger 