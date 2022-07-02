FROM node:12.16.3-alpine
COPY /dist ./
COPY /package.json ./
COPY /package-lock.json ./
COPY /.env ./
RUN apk add git && \
        npm i -g typescript@3.8.3 && \
        tsc -v && \
        npm i && \
        #npm i --production && \
        ls -la
CMD ["node", "main.js"]
