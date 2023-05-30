# Build the app for production
FROM node:alpine AS build

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install your dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Runtime image
FROM node:alpine

WORKDIR /home/node/app

# Copy from build image
COPY --from=build /app .

RUN npm i -g @nestjs/cli

# Create profile-pictures directory
RUN mkdir -p /home/node/uploads/profile-pictures && chown -R node:node /home/node/app && \
    chown -R node:node /home/node/uploads/profile-pictures

# Don't use root user
USER node