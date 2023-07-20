# syntax = docker/dockerfile:1.2

FROM node:16 as build-stage

WORKDIR /usr/src/app

ENV APOLLO_SERVER_HTTP=http://apollo-server:4000

ENV APOLLO_SERVER_WS=ws://apollo-server:4000

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html



