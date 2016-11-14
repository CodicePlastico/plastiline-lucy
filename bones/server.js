const mongoose = require('mongoose')
const winston = require('winston')
const airbrake = require('./airbrake')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const loggerMiddleware = require('../middlewares/logger')
const tokenMiddleware = require('../middlewares/token')

function setup(app, settings, modules) {
	const airbrakeInstance = airbrake.init(settings.airbrake)
	console.log('airbrake initialized')

  mongoose.connect(settings.dbServer + settings.dbName)

  mongoose.Promise = global.Promise
  mongoose.plugin(require('./mongoose-cleaner'));

  console.log('mongoose initialized')

  app.set('port', settings.serverPort)
  app.use(loggerMiddleware)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json())

  if(modules) {
    modules.forEach(m => {
      const mod = require(m)
      app.use(tokenMiddleware(settings), mod.routes)
      mod.addListeners()
      console.log('Module', m, 'loaded')
    })  
  }
  
  app.use(function(err, req, res, next) {
    if (err){
      winston.error(err)
      airbrakeInstance.notify(err)
      res.status(500).json({status: 500});
    }
    next()
  })

  return app
}

module.exports = setup
