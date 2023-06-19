FROM node:17.7.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1000

CMD ["npm", "start"]