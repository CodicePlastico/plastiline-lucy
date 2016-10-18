const appBuilder = require('./server')
const winston = require('winston')
require('winston-mongodb')
const mongo = require('mongodb').MongoClient
const postal = require('postal')
const async = require('async')

module.exports = {
	startApp: function(settings, airbrakeSettings, modulesDir, denormalizers) {
		const app = appBuilder(settings, airbrakeSettings, modulesDir);

		if (process.env.NODE_ENV === 'production'){
		  winston.remove(winston.transports.Console)
		}

		winston.exitOnError = false;
		winston.add(winston.transports.MongoDB, settings.log)
		winston.handleExceptions(new winston.transports.MongoDB(settings.log))

		if(denormalizers && denormalizers.length) {
			console.log('Registering', denormalizers.length, 'denormalizers')
			async.series(denormalizers, (err, res) => { console.log('Denormalizers registered') })
		}		

		const server = app.listen(app.get('port'), (err, res) => {
		  console.log(`Server listening on port ${server.address().port}`);
		});
	},
	denormalizer: function(sourceConnectionString, destConnectionString, denormalizer) {
		// denormalizer: [{ group: '', subscribers: [ { channel, topic, callback} ] } ]
		console.log('Build denormalizer', sourceConnectionString, destConnectionString, denormalizer.group)
		var source = null;
		var dest = null
		function connectSource(done) {
		  mongo.connect(sourceConnectionString, (err, src)  => { 
		    source = src
		    console.log('source ok')
		    done() 
		  })
		}

		function connectDest(done) {
		  mongo.connect(destConnectionString, (err, dst) => { 
		    dest = dst
		    console.log('dest ok')
		    done() 
		  })
		}

		function registerEventListener(done) {
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
		  	done()
		}

		return function(next) {
			console.log('Running denormalizer initialization', denormalizer.group)
			async.series([connectSource, connectDest, registerEventListener, function(done) {
				console.log('4th')
				done()
			}], function(err, res) {
				console.log('Denormalizer registered', denormalizer.group)
				next()				
			})
		}		
	}
}
