FROM bun:alpine
WORKDIR /server
COPY . /server
RUN apk update && apk add openssl musl zlib libgcc
RUN bun install
RUN bun run build
CMD ["sh","setup.sh"]