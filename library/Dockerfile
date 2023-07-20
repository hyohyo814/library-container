FROM node:16

COPY . .

WORKDIR /usr/src/app

EXPOSE 4000

RUN npm ci --only=production

ENV DEBUG=library-apollo-server:*

USER node

CMD ["npm", "start"]
