FROM node:20-alpine

WORKDIR /app

RUN chmod -R 777 /app

COPY . .

ENV NODE_ENV=production

RUN cd ./backend

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start"]