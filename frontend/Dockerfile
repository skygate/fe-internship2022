FROM node:16.15-alpine

WORKDIR /frontend

COPY . .
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]