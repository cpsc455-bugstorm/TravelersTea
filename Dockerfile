# Stage 1: Build the client and server
FROM node:18.16 AS builder

ARG REACT_APP_API_URL
ARG REACT_APP_MAPBOX_TOKEN

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_MAPBOX_TOKEN=$REACT_APP_MAPBOX_TOKEN

WORKDIR /app

COPY package.json yarn.lock ./
COPY client/package.json client/
COPY server/package.json server/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn workspace client build

# Stage 2: Run the application
FROM node:18.16

WORKDIR /app

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/node_modules ./node_modules

# Expose the server port
EXPOSE 5001

# Run the server.
CMD ["node", "server/index.js"]
