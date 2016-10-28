const fixtureBuilder = require('../lucy').test.fixture

module.exports = function(signature) {
	const params = {
		settings: require('./testing-settings'),
		signature: signature,
		fixturesPath: __dirname + '/fixtures'
	}
	return fixtureBuilder(params)
}
