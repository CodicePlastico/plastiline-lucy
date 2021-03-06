const axios = require('axios')
const mongodb = require('mongodb')
const async = require('async')

module.exports = function initIntegrationTestFixture(providedParams) {
	const params = Object.assign({ signature: null, fixturesPath: null }, providedParams)
	const clientConfig = {}
	if(params.signature) {
		clientConfig.headers = {
			'authorization': params.signature
		}
	}

	var fixture = {
		baseUrl: `http://localhost:${params.settings.serverPort}`,
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
		},
		importCollection: function(collName, done) {
			var docs = require(`${params.fixturesPath}/${collName}`)
			this.mongo.collection(collName).drop(() => {
				this.mongo.collection(collName).insertMany(docs, () => { done() })
			})
		},
		drop: function(collName, callback) {
  			return this.mongo.collection(collName).drop()
		},
		executeCmd: function(fn) {
			fn(this.mongo)
		},
		importJson: function(collName, done) {
			if (Array.isArray(collName)){
				const functions = collName.map(c => callback => { this.importCollection(c, callback) } )
				async.parallel(functions, done)
			} else {
				this.importCollection(collName, done)
			}
		}
	}
	var server = null

	before((done) => {
		const lucy = require('../lucy')
		const lucyParams = Object.assign({ callback: function() {
			mongodb.MongoClient.connect(params.settings.dbServer + params.settings.dbName, (err, db) => {
				fixture.mongo = db;
				done()
			})
		}}, params)
		server = lucy.startApp(lucyParams)
	})

	after(() => {
		if(server && server.close) {
			server.close()
			fixture.mongo.close()
		}		
	})

	return fixture
}