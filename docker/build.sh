#!/bin/bash

rsync -av -r -c --progress ../code ./  --exclude .git --exclude node_modules --exclude npm_debug.log --delete-excluded

docker build --tag "kafka-connect-monit" --rm=true --force-rm=true --no-cache=true .

rm -rf ./code