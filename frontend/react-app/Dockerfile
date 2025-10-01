FROM node:20-alpine

WORKDIR /app

# Сначала устанавливаем vite в чистую папку
RUN echo '{"devDependencies":{"vite":"^5.0.0"}}' > package.json
RUN npm install

# Теперь копируем твои файлы (кроме package.json)
COPY . .
RUN npm install

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]