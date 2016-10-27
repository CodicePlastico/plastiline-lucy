const Command = require('./model')

function createCommand(type, cmdFn){
  return params => new Promise(resolve => {
    var commandId = null
    Command.persistCommand({type: type, payload: params}).then(savedCommand => {
      commandId = savedCommand._id
      cmdFn(params)
        .then(resolve)
        .then(() => { Command.complete(commandId) })
    })
  })
}

module.exports = createCommand
