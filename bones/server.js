const mongoose = require('mongoose')
const winston = require('winston')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const loggerMiddleware = require('../middlewares/logger')
const tokenMiddleware = require('../middlewares/token')

function setup(app, settings, modules, initializer, postInit) {
  mongoose.connect(settings.dbServer + settings.dbName)

  mongoose.Promise = global.Promise
  mongoose.plugin(require('./mongoose-cleaner'));

  app.set('port', settings.serverPort)
  app.use(loggerMiddleware)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json())
  // TODO: Find a better solution
  app.locals.tokenMiddleware = tokenMiddleware

  if (initializer){
		initializer(app)
	}

  if(modules) {
    modules.forEach(m => {
      const mod = require(m)
      app.use(tokenMiddleware(settings), mod.routes)
      mod.addListeners()
    })  
  }
  
  if (postInit){
    postInit(app)
  }

  app.use(function(err, req, res, next) {
    if (err){
      winston.error(err)
      res.status(500).json({status: 500, error: err});
    }
    next()
  })

  return app
}

module.exports = setup
