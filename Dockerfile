FROM node:20-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV=production

ENV VITE_ADMIN_PASSWORD=<put_the_password_here>

RUN cd frontend && npm install && npm run build

RUN cd ../backend && npm install

EXPOSE 8080

CMD ["npm", "run", "start"]