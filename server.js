const express = require('express')
const mongoose = require('mongoose')
const winston = require('winston')
const airbrake = require('./airbrake')
const logger = require('./middlewares/logger')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')

function setup(settings, airbrakeParams) {
	const airbrakeInstance = airbrake.init(airbrakeParams)
	console.log('airbrake initialized')


  mongoose.connect(settings.dbServer + settings.dbName )

  mongoose.Promise = global.Promise
  mongoose.plugin(require('./mongoose-cleaner'));

  console.log('mongoose initialized')

  app.set('port', settings.serverPort)
  app.use(logger)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json())

  console.log('body parser initialized')

  app.use('/version', (req, res) => {
    fs.readFile('./package.json', 'utf8', (err, data) => {
      const info = JSON.parse(data)
      res.json({version: info.version})
    })
  })

/*
  const modules = ['users', 'shops', 'catalogue']
  
  modules.forEach(m => {
    const mod = require(`./modules/${m}`)
    app.use(mod.routes)
    mod.addListeners()
  })

  */

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
