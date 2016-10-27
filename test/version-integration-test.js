const assert = require('chai').assert
const fn = require('../bones/routes/version')
const fs = require('fs')
const axios = require('axios')

describe('Testing version route handler', () => {
	const fixture = initIntegrationTestFixture()	
	
	it('GET /version should get the version', (done) => {
		fixture.get('version').then((response) => {
			const pack = JSON.parse(fs.readFileSync('./package.json'))
			assert.equal(200, response.status)
			assert.equal(pack.name, response.data.name)
			assert.equal(pack.version, response.data.version)
			done()
		}).catch((error) => {
			done(error)
		})
	})
})

function initIntegrationTestFixture() {
	var fixture = {
		httpClient: axios.create({}),
		get: function(url, params) {
			const theUrl = `${this.baseUrl}/${url}`
			return this.httpClient.get(theUrl, {params: params})
		}
	}
	var server = null

	before(() => {
		const settings = {
		  env: 'test',
		  serverPort: 3103,
		  dbName: 'lucy-integration',
		  dbServer: 'mongodb://localhost:27017/',
		  log:{
		    level: 'debug',
		    db: 'mongodb://localhost:27017/lucy-integration',
		    capped: true
		  }
		}

		fixture.baseUrl = `http://localhost:${settings.serverPort}`

		const airbrakeSettings = {
		  clientId: '5b4c82ad-4952-1d09-a072-53d6d7c87532',
		  serviceHost: 'exceptions.codebasehq.com',
		  protocol: 'https'
		}

		const lucy = require('../lucy')
		server = lucy.startApp(settings, airbrakeSettings, null, [])
	})

	after(() => {
		if(server && server.close) {
			server.close()
		}		
	})

	return fixture
}
