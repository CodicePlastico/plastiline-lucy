const postal = require('postal')
const winston = require('winston')
const Event = require('./model')

function publishEvent(evtName, content){
  Event.persist({type: evtName, payload: content})
	.then(() => {
    postal.publish({
      channel: 'events',
      topic: evtName,
      data: content
    })
  }).catch(err => {
    winston.error(err)
  })
}

module.exports = publishEvent