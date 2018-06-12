const axios = require('axios')
const config = process.env.NODE_ENV == 'production' ? require('./config/prod.config') : require('./config/dev.config')
const hostname = config.HOSTNAME

async function get(path) {
	try {
		const url = `${hostname}${path}`
		const response = await axios.get(url)
		return response.data
	}
	catch(error) {
		console.error("Failed to get the request: " + error)
	}
}

/**
 * Subjects API Call
 */
async function getConnectors() {
	return await get('/connectors/')
}

async function getConnectorInfo(name) {
	return await get(`/connectors/${name}/status`)
}

function handleConnectorsSuccess(connectors) {
	const promises = []
	if(connectors.length > 0) {
		for(let i=0, connectorsLength = connectors.length; i < connectorsLength; i++) {
			promises.push(getConnectorInfo(connectors[i]))
		}
		return axios.all(promises).then(handleConnectorInfoSuccess)
	} else {
		console.log("No Connectors")
	}
}

function handleConnectorInfoSuccess(response) {
	return response
}

module.exports = {
	connectors: function() {
		return getConnectors().then(handleConnectorsSuccess)
	}
 }