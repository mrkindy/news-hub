# ===== Build React app =====
FROM node:18 AS build

WORKDIR /app

# ===== Install dependencies =====
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ===== Copy source code =====
COPY . .

# ===== Build production version =====
RUN npm run build

# ===== Serve app with Nginx =====
FROM nginx:alpine

# ===== Remove default Nginx static assets =====
RUN rm -rf /usr/share/nginx/html/*

# ===== Copy React build files =====
COPY --from=build /app/dist /usr/share/nginx/html

# ===== Copy custom Nginx config =====
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
