FROM node:16.15-alpine

WORKDIR /backend

COPY . .
RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]