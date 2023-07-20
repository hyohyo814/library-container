FROM node:16

WORKDIR /usr/src/app

COPY . .

EXPOSE 4000

RUN npm install

RUN npm install -g nodemon

CMD ["npm", "run", "dev"]

