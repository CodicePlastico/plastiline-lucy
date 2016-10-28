const fixtureBuilder = require('../lucy').test.fixture
const settings = require('./testing-settings')

const airbrakeSettings = {}

module.exports = function(signature) {
	return fixtureBuilder(settings, null, [], signature, __dirname + '/fixtures')
}
