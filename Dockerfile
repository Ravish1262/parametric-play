# Multi-stage Dockerfile for Parametric Play

# Stage 1: Build Client (Vite + React)
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Native tools for compiling better-sqlite3 if needed
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "server/src/index.js"]
