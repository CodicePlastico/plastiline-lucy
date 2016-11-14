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

    if (params.initializer){
			console.log('Registering custom initializer')
			params.initializer(app)
		}

		app = appBuilder(app, params.settings, params.modules);

		if (process.env.NODE_ENV === 'production'){
		  winston.remove(winston.transports.Console)
		}

		winston.exitOnError = false;
		winston.add(winston.transports.MongoDB, params.settings.log)
		winston.handleExceptions(new winston.transports.MongoDB(params.settings.log))

		if(params.denormalizers && params.denormalizers.length) {
			console.log('Registering', params.denormalizers.length, 'denormalizers')
			async.series(params.denormalizers, (err, res) => { console.log('Denormalizers registered') })
		}

		const server = app.listen(app.get('port'), (err, res) => {
		  console.log(`Server listening on port ${server.address().port}`);
		  if(params.callback) {
		  	params.callback()
		  }
		})

		server.on('close', () => {
			mongoose.connection.close()
			winston.remove('mongodb')
		})

		return server
	},
	denormalizer: function(sourceConnectionString, destConnectionString, denormalizer) {
		// denormalizer: [{ group: '', subscribers: [ { channel, topic, callback} ] } ]
		console.log('Build denormalizer', sourceConnectionString, destConnectionString, denormalizer.group)
		var source = null;
		var dest = null
		
		function connect(connString, done) {
		  mongo.connect(connString, (err, db)  => {
		  	if(err) {
		  		console.log('Error connecting to', connString, err)
		  		done(err)
		  	} else {
		  		console.log('Connection to', connString, 'ok')
		    	done(null, db) 
			}		    
		  })
		}

		function registerEventListener(source, dest) {
			console.log('Registering subscribers', denormalizer.group)
			denormalizer.subscribers.forEach(s => {
				console.log('Subscribe')
				postal.subscribe({
					channel: s.channel,
					topic: s.topic,
					callback: function(data) {
						s.callback(source, dest, data)
					}
				})
			})
			console.log('Subscribers registered')
		}

		return function(next) {
			console.log('Running denormalizer initialization', denormalizer.group)
			async.series([
				connect.bind(null, sourceConnectionString),
				connect.bind(null, destConnectionString),
			], function(err, res) {
				registerEventListener(res[0], res[1])
				console.log('Denormalizer registered', denormalizer.group)
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
