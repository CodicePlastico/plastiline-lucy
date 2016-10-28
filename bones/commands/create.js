const Command = require('./model')
const winston = require('winston')

function createCommand(type, cmdFn){
  return params => new Promise((resolve, reject) => {
    var commandId = null
    Command.persistCommand({type: type, payload: params})
      .then(savedCommand => {
        commandId = savedCommand._id
        cmdFn(params)
          .then(resolve)
          .then(() => { Command.complete(commandId) })
          .catch(reject)
      })
      .catch(err => {
        winston.error(err)
      })
  })
}

module.exports = createCommand
