FROM node:20-alpine

WORKDIR /app


RUN echo '{"devDependencies":{"vite":"^5.0.0"}}' > package.json
RUN npm install


COPY . .
RUN npm install

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]