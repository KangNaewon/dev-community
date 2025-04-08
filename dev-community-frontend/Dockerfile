#React 앱 빌드
FROM node:20 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

#Nginx 기반 이미지로 정적 파일 서빙
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
