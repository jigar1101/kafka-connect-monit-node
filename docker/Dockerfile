FROM node:alpine

ADD code /home/code/

ADD etc /etc

RUN apk update && \
	apk add supervisor && \
	mkdir /var/log/supervisord && \
	cd /home/code && \
	yarn && \
	cd client && yarn && yarn build

EXPOSE 80

ENTRYPOINT /usr/bin/supervisord -n -c /etc/supervisord.conf