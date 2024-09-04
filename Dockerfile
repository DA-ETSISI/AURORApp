FROM node:20-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV=production

ENV VITE_ADMIN_PASSWORD=<put_the_password_here>

RUN npm install

RUN npm run build --workspace frontend

EXPOSE 8080

CMD ["npm", "run", "start", "--workspace", "backend"]