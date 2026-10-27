
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY server.js ./

EXPOSE 3000

CMD ["node", "--env-file-if-exists=.env", "server.js"]
