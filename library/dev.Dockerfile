FROM node:16

WORKDIR /usr/src/app

COPY . .

EXPOSE 4000

RUN npm ci

CMD ["npm", "run", "dev"]

