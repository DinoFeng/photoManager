FROM node:erbium-alpine

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app

COPY . /usr/src/app

VOLUME /usr/src/app/upload

RUN yarn install

RUN yarn build

EXPOSE 10030
CMD yarn run
