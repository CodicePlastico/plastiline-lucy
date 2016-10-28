const assert = require('chai').assert
const postal = require('postal')
const send = require('../lucy').events.send
const integrationTestHelper = require('./test-helper')

describe('Testing send event', () => {  
  const fixture = integrationTestHelper()
  
  beforeEach(() => {
    postal.reset()
    fixture.drop('events')
  })

  it('Should publish using postal', (done) => {

    postal.subscribe({
      channel: 'events',
      topic: 'fake-event',
      callback: function(evt) {
        assert.equal('foo@bar.it', evt.email)
        done()
      }
    })

    send('fake-event', {email: 'foo@bar.it'})
  })

  it('Should save the event to mongo', (done) => {
    postal.subscribe({
      channel: 'events',
      topic: 'fake-event',
      callback: function() {
        const coll = fixture.mongo.collection('API_events')
        coll.findOne({type: 'fake-event'}, (err, doc) => {
          assert.isNotNull(doc)
          assert.equal('foo@bar.it', doc.payload.email)
          assert.isDefined(doc.timestamp)
          done()
        })
      }
    })

    send('fake-event', {email: 'foo@bar.it'})
  })
})
