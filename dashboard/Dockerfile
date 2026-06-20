# المرحلة الأولى: البناء
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build # (أو npm run build حسب ما تستخدم)

# المرحلة الثانية: التشغيل عبر Nginx
FROM nginx:alpine
# تأكد من مسار البناء الخاص بك (dist أو build حسب Vite أو Webpack)
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]