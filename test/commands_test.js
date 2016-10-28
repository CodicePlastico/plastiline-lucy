const assert = require('chai').assert
const createCommand = require('../lucy').commands.create
const integrationTestHelper = require('./test-helper')

describe('Testing command factory', () => {
  const fixture = integrationTestHelper()
  it('Should create a command and execute it', (done) => {
    const cmd = createCommand('test-command', p => {      
      return Promise.resolve(p)
    })
    cmd({foo:'bar'}).then((res) => {
      assert.equal('bar', res.foo) 
      done()
    }).catch(done)
  })

  it('Exec should return a promise', (done) => {
    const cmd = createCommand('test-command', p => {
      assert.equal('bar', p.foo)
      return Promise.resolve(p)
    })
    const result = cmd({foo:'bar'})
    assert.isNotNull(result.then)
    assert.isNotNull(result.catch)
    done()
  })
})
