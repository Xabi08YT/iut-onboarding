FROM docker.io/node:20-alpine
WORKDIR /server
COPY ../ /server
RUN npm ci
RUN npm run build
CMD node .output/server/index.mjs