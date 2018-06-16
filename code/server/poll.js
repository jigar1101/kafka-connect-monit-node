const {connectors} = require('./main')
const pollingTime = 600000
let timer = null
let oldAlertingConnectors = []

function startPoll() {
	clearInterval(timer)
	timer = setInterval(pollConnector, pollingTime)
	pollConnector()
}

async function pollConnector() {
	const response = await connectors()
	monitor(response)
}

function monitor(connectors) {
	if(connectors && connectors.length > 0) {

		const failedConnectors = connectors.filter(connector => {
			const connectorStatus = connector.connector.state !== 'RUNNING'
			const failedTasked = connector.tasks.filter(task => {
				return task.state !== 'RUNNING'
			})
			return connectorStatus || failedTasked.length > 0
		})
		const connectorsToBeMailed = failedConnectors.map(connector => connector.name)
		const newAlertingConnectors = []
		for(const connector of connectorsToBeMailed) {
			//This means the connector is still alerting and is an old connector so do nothing and move it to newAlertingConnectors
			newAlertingConnectors.push(connector)

			if(oldAlertingConnectors.indexOf(connector) > -1) {
				//Remove from old alerting connector
				oldAlertingConnectors.splice(oldAlertingConnectors.indexOf(connector), 1)
			}
		}

		//At the end of this loop, newAlertingConnectors will contain connectors which need alertin
		//oldAlertingConnectors will be the ones which are OK

		//Send email for alert and ok
		sendEmail(newAlertingConnectors, oldAlertingConnectors)

		//Assign back oldAlertingConnectors
		oldAlertingConnectors = [...newAlertingConnectors]
	}
}

function sendEmail(alertingConnectors, okConnectors) {
	console.log("Alerting", alertingConnectors)
	console.log("OK", okConnectors)	
}

module.exports = startPoll