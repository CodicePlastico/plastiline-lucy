const R = require('ramda')
const ObjectId = require('mongoose').Types.ObjectId;

function clean(schema){
  R.keys(schema).forEach(k => {
    if (k == '_id'){
        schema.id = schema[k]
        delete schema._id
    } else if (R.is(Object, schema[k])){
      clean(schema[k]) 
    } 
    delete schema.__v
  })
  return schema
}

module.exports = exports = function cleaner(schema) {
  schema.set('toJSON', {
    transform: function(doc, ret) {
      const res = clean(ret)
      return res
    }
  })
}