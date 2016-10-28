const express = require('express')
const mongoose = require('mongoose')
const winston = require('winston')
const airbrake = require('./airbrake')
const logger = require('./middlewares/logger')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const path = require('path')
const tokenMiddleware = require('./middlewares/token')

function setup(settings, airbrakeParams, modulesDir) {
	const airbrakeInstance = airbrake.init(airbrakeParams)
	console.log('airbrake initialized')

  mongoose.connect(settings.dbServer + settings.dbName)

  mongoose.Promise = global.Promise
  mongoose.plugin(require('./mongoose-cleaner'));

  console.log('mongoose initialized')

  app.set('port', settings.serverPort)
  app.use(logger)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json())

  console.log('body parser initialized')
  app.use('/version', require('./bones/routes/version'))

  if(modulesDir) {
    const modules = fs.readdirSync(modulesDir)
    modules.forEach(m => {
      const moduleDir = path.join(modulesDir, m)
      if(fs.lstatSync(moduleDir).isDirectory()) {
        const mod = require(moduleDir)
        app.use(tokenMiddleware(settings), mod.routes)
        mod.addListeners()
        console.log('Module', m, 'loaded')
      }
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
