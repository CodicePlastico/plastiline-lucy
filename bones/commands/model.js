const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  timestamp: Number,
  completeTs: {type: Number, default: 0},
  payload: {} }, {collection: 'API_commands'})

schema.statics.persistCommand = (cmd) => {
  const doc = JSON.parse(JSON.stringify(cmd));
  doc._id = cmd.id
  if (!doc._id){
    doc._id = mongoose.Types.ObjectId()
  }
  doc.timestamp = Date.now()
  if (doc.payload.password){
    doc.payload.password = '*****'
  }  
  return model.create(doc)
}

schema.statics.complete = (id) => {
  model.update({_id: id}, { $set: { completeTs: Date.now() }}).exec()
}

const model = mongoose.model('Command', schema)
module.exports = model
