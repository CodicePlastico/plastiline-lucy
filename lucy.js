const express = require('express')
const appBuilder = require('./bones/server')
const winston = require('winston')
require('winston-mongodb')
const mongo = require('mongodb').MongoClient
const postal = require('postal')
const async = require('async')
const mongoose = require('mongoose')

var app = express()

module.exports = {
	startApp: function(providedParams) {
		const params = Object.assign({ settings: {}, modules: [],  denormalizers: [], initializer:null, callback: null}, providedParams)

		app = appBuilder(app, params.settings, params.modules, params.initializer, params.postInit);

		if (process.env.NODE_ENV === 'production'){
		  winston.remove(winston.transports.Console)
		}

		winston.exitOnError = false;
		winston.add(winston.transports.MongoDB, params.settings.log)
		winston.handleExceptions(new winston.transports.MongoDB(params.settings.log))

		if(params.denormalizers && params.denormalizers.length) {
			async.series(params.denormalizers, (err, res) => { })
		}

		const server = app.listen(app.get('port'), (err, res) => {
		  console.log(`Server listening on port ${server.address().port}`);
		  if(params.callback) {
		  	params.callback()
		  }
		})

		server.on('close', () => {
			if (mongoose.connection.readyState === 1)
			{	
				mongoose.connection.close()
			}
			winston.remove('mongodb')
		})

		return server
	},
	denormalizer: function(sourceConnectionString, destConnectionString, denormalizer) {
		// denormalizer: [{ group: '', subscribers: [ { channel, topic, callback} ] } ]
		var source = null;
		var dest = null
		
		function connect(connString, done) {
		  mongo.connect(connString, (err, db)  => {
		  	if(err) {
		  		console.log('Error connecting to', connString, err)
		  		done(err)
		  	} else {
		    	done(null, db) 
			}		    
		  })
		}

		function registerEventListener(source, dest) {
			denormalizer.subscribers.forEach(s => {
				postal.subscribe({
					channel: s.channel,
					topic: s.topic,
					callback: function(data) {
						s.callback(source, dest, data)
					}
				})
			})
		}

		return function(next) {
			async.series([
				connect.bind(null, sourceConnectionString),
				connect.bind(null, destConnectionString),
			], function(err, res) {
				registerEventListener(res[0], res[1])
				next()
			})
		}		
	},
	events: require('./bones/events'),
	commands: require('./bones/commands'),
	test: {
		fixture: require('./test/integration-fixture'),
		fakeSignature: require('./test/fake-signature')
	}
}
