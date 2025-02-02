FROM docker.io/node:20-alpine
WORKDIR /server
COPY . /server
RUN apk update && apk add openssl musl zlib libgcc
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
CMD ["sh","setup.sh"]