const {connectors} = require('./main')

async function startPoll() {
	const response = await connectors()
	console.log(response)
}

module.exports = startPoll