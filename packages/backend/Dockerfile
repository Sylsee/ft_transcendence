FROM node:14-alpine as dev

WORKDIR /usr/src/app
RUN npm i -g @nestjs/cli --silent
COPY package*.json .

COPY . .

RUN npm i