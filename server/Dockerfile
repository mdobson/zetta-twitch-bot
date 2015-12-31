FROM node:latest
MAINTAINER Matthew Dobson

ADD . /server
WORKDIR /server
RUN npm install

ENV PORT 3000
EXPOSE 3000

CMD ["server.js"]
ENTRYPOINT ["node"]
