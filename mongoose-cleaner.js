// this plugin removes fields that are present in the database but are not
// defined in the schema
// NOTE: it process only first level fields and does not check nested attributes\
module.exports = exports = function cleaner(schema) {
  schema.set('toJSON', {
    transform: function(doc, ret) {
      const schemaKeys = Object.keys(schema.paths).map(p => p.split('.')[0])
      Object.keys(ret).forEach(f => {
        if (schemaKeys.indexOf(f) === -1){
          delete ret[f]
        }
      })
      ret.id = ret._id
      delete ret.__v
      delete ret._id
    }
  })
}