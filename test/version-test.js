const assert = require('chai').assert
const fn = require('../bones/routes/version')
const fs = require('fs')

describe('Testing version routes', () => {
  it('should get the version', (done) => {
    const pack = JSON.parse(fs.readFileSync('./package.json'))
    var result = {}
    fn({}, {
    	json: function(data) {
    		assert.equal(pack.name, data.name)
    		assert.equal(pack.version, data.version)
    		done()
    	}
    })
  })
})
