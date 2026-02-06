FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create directory for database
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/todo.db

EXPOSE 5000

CMD ["node", "server.js"]
