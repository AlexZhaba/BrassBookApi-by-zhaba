# Этап разработки
FROM node:20-alpine AS development

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копируем остальные файлы
COPY . .

# Устанавливаем переменные окружения для разработки
ENV NODE_ENV=development

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]