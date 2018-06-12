const express = require('express');
const path = require('path');
const {connectors} = require('./main')
const startPoll = require('./poll')

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/connectors', callConnectors.bind(this, connectors))

app.use(express.static(path.join(__dirname, '..', 'client/build')));
app.listen(port, () => {
	startPoll();
});

function callConnectors(func, req, res) {
	return func.call(this).then((response) => {
		if(response) {
			return res.send(response)
		} else {
			console.error("Error calling connectors")
			res.status(500);
			res.send();
		}
	})
}