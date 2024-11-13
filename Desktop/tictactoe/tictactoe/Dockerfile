# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port Vite uses by default
EXPOSE 5173

# Run the application in developme  nt mode
CMD npm run dev