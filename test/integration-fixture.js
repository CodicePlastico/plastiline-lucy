const axios = require('axios')

module.exports = function initIntegrationTestFixture(settings, airbrakeSettings, modulesDir, denormalizers, signature) {
	const clientConfig = {}
	if(signature) {
		clientConfig.headers = {
			'authorization': signature
		}
	}
	var fixture = {
		baseUrl: `http://localhost:${settings.serverPort}`,
		httpClient: axios.create(clientConfig),
		buildUrl: function(url) {
			var base = this.baseUrl
			if(!url.startsWith('/')) {
				base = base + '/'
			}
			return base + url
		},
		get: function(url, params, config) {
			const theUrl = this.buildUrl(url)
			return this.httpClient.get(theUrl, Object.assign(config || {}, { params: params }))
		},
		post: function(url, body, config) {
			const theUrl = this.buildUrl(url)
			return this.httpClient.post(theUrl, body)
		},
		put: function(url, body, config) {
			const theUrl = this.buildUrl(url)
			return this.httpClient.put(theUrl, body, config)
		},
		delete: function(url, config) {
			const theUrl = this.buildUrl(url)
			return this.httpClient.delete(theUrl, config)
		}
	}
	var server = null

	before((done) => {
		const lucy = require('../lucy')
		server = lucy.startApp(settings, airbrakeSettings, modulesDir, denormalizers, done)
	})

	after(() => {
		if(server && server.close) {
			console.log('Shutting down HTTP server after integration tests')
			server.close()
		}		
	})

	return fixture
}