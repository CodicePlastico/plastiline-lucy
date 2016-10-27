const postal = require('postal')
const Event = require('./model')

function publishEvent(evtName, content){
  Event.persist({type: evtName, payload: content}, () => {
    postal.publish({
      channel: 'events',
      topic: evtName,
      data: content
    })
  })
}

module.exports = publishEvent