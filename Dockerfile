FROM node:7.5.0-alpine

RUN mkdir /app
WORKDIR /app

ADD package.json .
RUN npm install -q

#ADD . . # josh
COPY . /app # tutorial

EXPOSE 8080

RUN npm start # spin up temp container run then spin down.  in this case db service wont work
CMD ["npm", "start"] # when have this image when we run a container off this execute after there is a build of this image.  makes sure dependencies are fu
