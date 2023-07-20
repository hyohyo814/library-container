FROM node:16

COPY . .

EXPOSE 3000

ENV APOLLO_SERVER_HTTP=http://localhost:4000

ENV APOLLO_SERVER_WS=http://localhost:4000

WORKDIR /usr/src/app

RUN npm install

CMD ["npm", "start"]
