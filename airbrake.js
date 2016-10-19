const airbrake = require('airbrake')

module.exports = {
	init: function(params) {
		const client = airbrake.createClient(params.clientId);
		client.consoleLogError = true
		client.serviceHost = params.serviceHost;
		client.protocol = params.protocol || 'https';

		if (process.env.NODE_ENV !== 'test'){
		  client.handleExceptions();
		}

		return client
	}
};