const mongoose = require('mongoose')

const schema = new mongoose.Schema({ 
  type: String, 
  timestamp: Number,
  payload: {} 
}, {collection: 'API_events'})

schema.statics.persist = (evt, callback) => {
  const doc = JSON.parse(JSON.stringify(evt));
  doc.timestamp = Date.now()
  model.create(doc, (err, newDoc) => {
    if (typeof callback === 'function'){
      callback(newDoc)
    }
  })
}

const model = mongoose.model('EventLog', schema)
module.exports = model
