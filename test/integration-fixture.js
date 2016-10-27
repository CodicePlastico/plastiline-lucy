const axios = require('axios')

module.exports = function initIntegrationTestFixture(settings, airbrakeSettings, modulesDir, denormalizers) {
	var fixture = {
		baseUrl: `http://localhost:${settings.serverPort}`,
		httpClient: axios.create({}),
		buildUrl: function(url) {
			var base = this.baseUrl
			if(!url.startsWith('/')) {
				base = base + '/'
			}
			return base + url
		},
		get: function(url, params) {
			const theUrl = this.buildUrl(url)
			return this.httpClient.get(theUrl, {params: params})
		},
		post: function(url, body) {
			const theUrl = this.buildUrl(url)
			return this.httpClient.post(theUrl, body)
		}
	}
	var server = null

	before(() => {
		const lucy = require('../lucy')
		server = lucy.startApp(settings, airbrakeSettings, modulesDir, denormalizers)
	})

	after(() => {
		if(server && server.close) {
			console.log('Shutting down HTTP server after integration tests')
			server.close()
		}		
	})

	return fixture
}