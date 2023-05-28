# Build the app for production
FROM node:14-alpine

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
COPY package*.json ./

# Install NestJS CLI
RUN npm i -g @nestjs/cli

# Install your dependencies
RUN npm ci

# Bundle app source
COPY . .

# Create profile-pictures directory
RUN mkdir -p /home/node/uploads/profile-pictures

# Create a non-root user
RUN chown -R node:node /home/node/app && \
    chown -R node:node /home/node/uploads/profile-pictures

# Don't use root user
USER node
