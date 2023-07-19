FROM node:16

COPY . .

EXPOSE 3000

WORKDIR /usr/src/app

RUN npm ci

CMD ["npm", "start"]
