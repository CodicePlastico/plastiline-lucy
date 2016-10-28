module.exports = {
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
	},
	airbrake: {
		clientId: '5b4c82ad-4952-1d09-a072-53d6d7c87532',
		serviceHost: 'exceptions.codebasehq.com',
		protocol: 'https'
	}
}
