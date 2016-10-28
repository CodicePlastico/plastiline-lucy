const assert = require('chai').assert
const fs = require('fs')
const fixtureBuilder = require('./integration-fixture')
const signatureBuilder = require('./fake-signature')

const settings = require('./testing-settings')

describe('Testing version route handler', () => {
	const modulesDir =__dirname + '/../modules'
	const deserializers = []
	const fixture = fixtureBuilder(settings, modulesDir, deserializers, signatureBuilder('test000', 'test@codiceplastico.com', settings.jws))
	
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
