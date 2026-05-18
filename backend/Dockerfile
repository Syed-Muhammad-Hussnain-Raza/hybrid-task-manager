# Backend Dockerfile
# Build context: ./backend  (only the backend folder)

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache wget

# Copy package files first (Docker layer caching -
# npm install only reruns if package.json changes)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Health check - Docker will mark container unhealthy if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]