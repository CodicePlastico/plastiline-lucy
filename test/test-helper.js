const fixtureBuilder = require('../lucy').test.fixture
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

const airbrakeSettings = {}

module.exports = function(signature) {
	return fixtureBuilder(settings, airbrakeSettings, null, [], signature, __dirname + '/fixtures')
}
