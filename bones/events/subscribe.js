const postal = require('postal')

function subscribe(evtName, handler){
  return postal.subscribe({
    channel: 'events',
    topic: evtName,
    callback: function(data) {
      handler(data)  
    }
  })
}

module.exports = subscribe

