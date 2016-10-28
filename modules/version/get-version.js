const fs = require('fs')

module.exports = function(req, res) {
	fs.readFile('./package.json', 'utf8', function(err, data) {
	  	const info = JSON.parse(data)
	  	res.json({name: info.name, version: info.version})
	})
}