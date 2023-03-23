# Build the app for production
FROM node:14-alpine

# Create app directory
WORKDIR /home/node/app

# Install NestJS CLI
RUN npm i -g @nestjs/cli

# Create a non-root user
RUN chown -R node:node /home/node/app

# Don't use root user
USER node