#!/bin/bash

docker run -d --name kafka-connect-monit --env TIER="prod" -p 5000:5000 kafka-connect-monit