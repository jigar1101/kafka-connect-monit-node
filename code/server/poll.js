const {connectors} = require('./main')
const config = process.env.NODE_ENV == 'production' ? require('./config/prod.config') : require('./config/dev.config')
const nodemailer = require('nodemailer')

let timer = null
let transporter = null
let oldAlertingConnectors = []

function startPoll() {
	clearInterval(timer)
	transporter = createTransporter()
	timer = setInterval(pollConnector, config.POLLING_TIME)
	pollConnector()
}

function createTransporter() {
	// create reusable transporter object using the default SMTP transport
	return nodemailer.createTransport({
        host: config.EMAIL.HOST,
        port: config.EMAIL.PORT,
        secure: false // true for 465, false for other ports
	});
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

		if(newAlertingConnectors.length || oldAlertingConnectors.length) {
			//Send email for alert and ok
			sendEmail(newAlertingConnectors, oldAlertingConnectors)
		}

		//Assign back oldAlertingConnectors
		oldAlertingConnectors = [...newAlertingConnectors]
	}
}

function getEmailBody(alertingConnectors, okConnectors) {
	const alertList = (alertingConnectors.map(connector => `<li>${connector}</li>`)).join('')
	const okList = (okConnectors.map(connector => `<li>${connector}</li>`)).join('')
	return (
		`<div>
			<div>
				<b>Alerting Connectors</b>
				<ul>
					${alertList.length ? alertList : 'No alerting connectors'}
				</ul>
			</div>
			<div>
				<b>OK Connectors</b>
				<ul>
					${okList.length ? okList : `0 connectors recovered from the previous alerting list`}
				</ul>
			</div>
		</div>`
	);
}

function sendEmail(alertingConnectors, okConnectors) {
	const recovered = alertingConnectors.length === 0 && okConnectors.length > 0
	// setup email data with unicode symbols
    let mailOptions = {
        from: config.EMAIL.FROM, // sender address
        to: config.EMAIL.TO, // list of receivers
        subject: `Kafka Connect ${config.HOSTNAME} - ${recovered ? 'OK' : 'ALERTING'}`, // Subject line
        html: getEmailBody(alertingConnectors, okConnectors) // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
	});
}

module.exports = startPoll