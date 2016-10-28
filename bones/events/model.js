const mongoose = require('mongoose')

const schema = new mongoose.Schema({ 
  type: String, 
  timestamp: Number,
  payload: {} 
}, {collection: 'API_events'})

schema.statics.persist = evt => {
  const doc = JSON.parse(JSON.stringify(evt));
  doc.timestamp = Date.now()
  return model.create(doc)
}

const model = mongoose.model('EventLog', schema)
module.exports = model
