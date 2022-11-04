FROM node:18-bullseye

WORKDIR /radio-scanner-server

ADD . /radio-scanner-server
RUN npm install --prefix /radio-scanner-server

CMD ["/usr/local/bin/npm", "--prefix", "/radio-scanner-server", "run", "start"]
EXPOSE 3000