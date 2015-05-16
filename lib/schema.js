var fmap = require('./fmap')
var Schema = require('./BaseSchema')

schema = module.exports = function(schemaDescription) {
  var doc, definitions, schemaObject

  if (arguments.length === 2) {
    doc = schemaDescription
    schemaDescription = arguments[1]
  }

  if (arguments.length === 3) {
    doc = schemaDescription
    definitions = arguments[1]
    schemaDescription = arguments[2]
  }

  if (this instanceof schema) {
    // When called with new, create a schema object and then return the schema function
    var constructor = Schema.extend(schemaDescription)
    schemaObject = new constructor()

  } else {
    // When called as simple function, forward everything to fromJS
    // and then resolve schema.self to the resulting schema object
    schemaObject = Schema.fromJS(schemaDescription)
    schema.self.resolve(schemaObject)
  }
  if (definitions) schemaObject.definitions = fmap(definitions, function (def, id) {
    var sch = Schema.fromJS(def)
    sch.id = id
    return sch
  })
  if (doc) schemaObject.doc = doc
  return schemaObject.wrap()
}

schema.Schema = Schema

schema.toJSON = function(sch) {
  return Schema.fromJS(sch).toJSON()
}

schema.fromJS = function(sch) {
  return Schema.fromJS(sch).wrap()
}

schema.fromJSON = function(sch) {
  return Schema.fromJSON(sch).wrap()
}

// define js-schema using AMD
if (typeof define === 'function' && define.amd) {
  define([], function(){
    return schema;
  });
}
