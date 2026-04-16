FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
COPY frontend/.env* ./

RUN npm ci

COPY frontend/ ./

RUN echo "=== VITE VARIABLES DURING BUILD ===" && \
    echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" && \
    echo "=====================================" && \
    npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN echo '<h1>Frontend is running</h1><pre id="env"></pre><script>document.getElementById("env").textContent = JSON.stringify(import.meta.env, null, 2);</script>' > /usr/share/nginx/html/debug.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]