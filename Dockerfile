FROM docker.io/node:24-alpine
WORKDIR /server
COPY . /server
RUN apk update && apk add openssl musl zlib libgcc
RUN npm ci
RUN npm run build
CMD ["sh","setup.sh"]