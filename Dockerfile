FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3333

CMD ["node", "./dist/main.js"]
