const assert = require('chai').assert
const postal = require('postal')
const subscribe = require('../lucy').events.subscribe

describe('Testing subscribeEvent', () => {
  beforeEach(() => {
    postal.reset()
  })

  it('Should subscribe using postal', (done) => {
   
    subscribe('event-type', (evt) => {
      assert.equal(1, evt.foo)
      assert.equal('hello', evt.bar)
      done()
    })

    postal.publish({
      channel: 'events',
      topic: 'event-type',
      data: {foo: 1, bar: 'hello'}
    })
  })
})

