const assert = require('chai').assert
const fs = require('fs')
const fixtureBuilder = require('./integration-fixture')
const signatureBuilder = require('./fake-signature')

const settings = {
	env: 'test',
	serverPort: 3103,
	dbName: 'lucy-integration',
	dbServer: 'mongodb://localhost:27017/',
	log:{
		level: 'debug',
		db: 'mongodb://localhost:27017/lucy-integration',
		capped: true
	},
	jws: {
		secret: 'yo',
    	alg: 'HS256'
	}
}

const airbrakeSettings = {
	clientId: '5b4c82ad-4952-1d09-a072-53d6d7c87532',
	serviceHost: 'exceptions.codebasehq.com',
	protocol: 'https'
}

describe('Testing version route handler', () => {
	const modulesDir =__dirname + '/../modules'
	const deserializers = []
	const fixture = fixtureBuilder(settings, airbrakeSettings, modulesDir, deserializers, signatureBuilder('test000', 'test@codiceplastico.com', settings.jws))
	
	it('GET /version should get the version', (done) => {
		fixture.get('/version').then((response) => {
			const pack = JSON.parse(fs.readFileSync('./package.json'))
			assert.equal(200, response.status)
			assert.equal(pack.name, response.data.name)
			assert.equal(pack.version, response.data.version)
			done()
		}).catch((error) => {
			console.log(error.response.status, error.response.message)
			done(error)
		})
	})
})
