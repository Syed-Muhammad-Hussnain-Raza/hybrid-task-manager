# Frontend Dockerfile
# nginx Alpine - serves static HTML/JS/CSS files on port 80
# Build context: ./frontend (only the frontend folder)

FROM nginx:1.25-alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend static files
COPY index.html /usr/share/nginx/html/
COPY script.js  /usr/share/nginx/html/
COPY style.css  /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# nginx runs in foreground
CMD ["nginx", "-g", "daemon off;"]