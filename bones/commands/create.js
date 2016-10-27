const Command = require('./model')

function createCommand(type, cmdFn) {
	return function(params) {
		return new Promise((resolve, reject) => {
			var commandId = null
			const pp = Command.persistCommand({type: type, payload: params})
			pp.then(savedCommand => {
				commandId = savedCommand._id
				cmdFn(params)
				.then(resolve)
				.then(() => { Command.complete(commandId) })
			}).catch((err) =>  {
				reject(err)
			})
		})
	}
}

module.exports = createCommand
