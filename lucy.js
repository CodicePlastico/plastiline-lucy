const appBuilder = require('./server')
const winston = require('winston')
require('winston-mongodb')

module.exports = {
	startApp: function(settings, airbrakeSettings) {
		const app = appBuilder(settings, airbrakeSettings);		

		if (process.env.NODE_ENV === 'production'){
		  winston.remove(winston.transports.Console)
		}

		winston.exitOnError = false;
		winston.add(winston.transports.MongoDB, settings.log)
		winston.handleExceptions(new winston.transports.MongoDB(settings.log))

		const server = app.listen(app.get('port'), () => {
		  console.log(`Server listening on port ${server.address().port}`);
		});
	}
}