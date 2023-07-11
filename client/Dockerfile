# Наш Dockerfile для React.js додатку

# Виберіть образ node
FROM node:14 as build

# Встановіть директорію роботи в контейнері
WORKDIR /app

# Копіюйте package.json та package-lock.json в робочу директорію
COPY package*.json ./

# Встановіть всі залежності
RUN npm install

# Копіюйте весь код додатку в контейнер
COPY . .

# Створіть production build
RUN npm run build

# Образ для production
FROM nginx:1.17.1-alpine

# Копіюйте конфігурацію nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копіюйте build до nginx
COPY --from=build /app/build /usr/share/nginx/html/chat-deem

# Відкриваємо порт 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
