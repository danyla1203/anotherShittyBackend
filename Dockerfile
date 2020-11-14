FROM node:15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY dist .

EXPOSE 3001
CMD [ "node", "dist/src/index.js" ]