# Kafka Connect Monitoring (Node)

A monitoring service for Kafka Connect.

This application allows users to 
- View the **status** of the connectors in the Kafka Connect cluster on a dashboard.
- Send email **alerts** in case of any failure.

# Configuration

Update the `server/config/dev.config.js` & `server/config/dev.config.js` before using the Kafka Connect Monitoring

### Docker
Kafka Connect Monit is very easy to install and deploy in a Docker container.

Simply use the Dockerfile to build the image, one can modify the image name and the port to be exposed in the `build.sh` and `run.sh`

```sh
cd docker
sh build.sh
```
This will create the Kafka Connect Monit image and pull in the necessary dependencies.

Once done, run the Docker image and map the port to whatever you wish on your host. In this, the port 5000 of the host to port 5000 of the Docker

```sh
cd docker
sh run.sh
```

Verify the deployment by navigating to your server address in your preferred browser. A dashboard showing the status of the connectors would appear.

```sh
localhost:5000
```

### Development

Want to contribute? Great!

Kafka Connect Monitoring uses Node for fast development.

Open your favorite Terminal and run these commands.

```sh
cd code
npm install
cd client
npm install
cd ../server
npm run dev
```

License
----

MIT
