FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
ENV APP_VERSION=v3
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
