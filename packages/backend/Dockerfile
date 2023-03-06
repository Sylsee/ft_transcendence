# Build the app for development
FROM node:14-alpine as dev

# Create app directory
WORKDIR /usr/src/app

# Install NestJS CLI
RUN npm i -g @nestjs/cli --silent

# Install app dependencies
COPY package*.json ./
RUN npm i

# Copy app source
COPY . .

# Don't use root user
USER node

# Expose port
EXPOSE ${BACKEND_PORT}

# Start the app
CMD [ "npm", "run", "start:dev" ]

# Build the app for production
FROM node:14-alpine as prod

# Create app directory
WORKDIR /usr/src/app

# Install NestJS CLI
RUN npm i -g @nestjs/cli --silent

# Install app dependencies
COPY package*.json ./
RUN npm i --only=prod

# Copy app source
COPY . .

# Don't use root user
USER node

# Expose port
EXPOSE ${BACKEND_PORT}

# Start the app
CMD [ "npm", "run", "start:prod" ]