const axios = require('axios')

module.exports = function initIntegrationTestFixture(settings, airbrakeSettings, modulesDir, denormalizers) {
	var fixture = {
		baseUrl: `http://localhost:${settings.serverPort}`,
		httpClient: axios.create({}),
		get: function(url, params) {
			const theUrl = `${this.baseUrl}/${url}`
			return this.httpClient.get(theUrl, {params: params})
		}
	}
	var server = null

	before(() => {
		const lucy = require('../lucy')
		server = lucy.startApp(settings, airbrakeSettings, modulesDir, denormalizers)
	})

	after(() => {
		if(server && server.close) {
			server.close()
		}		
	})

	return fixture
}