FROM node:alpine AS build
WORKDIR /app
COPY . .

# Set BASE_HREF
ARG BASE_HREF
RUN npm ci && npm run build -- --base-href $BASE_HREF

# stage 2

FROM nginx:alpine
COPY --from=build /app/dist/raven2-dashboard /usr/share/nginx/html/raven2-dashboard/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
