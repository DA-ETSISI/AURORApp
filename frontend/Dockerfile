
FROM node:20-alpine

WORKDIR /app

ARG VITE_HOST

ARG VITE_ADMIN_PASSWORD

ENV VITE_HOST=$VITE_HOST

ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

CMD [ "serve", "-s", "dist" ]