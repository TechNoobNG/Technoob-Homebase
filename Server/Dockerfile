FROM node:lts-slim
ENV NODE_ENV=production
LABEL authors="oluwatobilobaaremu"

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update || : && apt-get install -y \
    python3 \
    build-essential

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install -g puppeteer --unsafe-perm=true
RUN npm install --omit=dev
RUN node node_modules/puppeteer/install.js
COPY . .
ENV PORT=3000
ENV JWT_EXPIRES=10m
ENV JWT_COOKIE_EXPIRES_IN=10
ENV SALT_ROUNDS=12
ENV TOKEN_EXPIRATION_TIME=10m
ENV AZURE_STORAGE_ACCOUNT_NAME=stackliteblob
ENV LIVE_BASE_URL=technoob-staging.azurewebsites.net
ENV AZURE_QUEUE_NAME=noob-queue
ENV AZURE_QUEUE_URL='https://stackliteblob.queue.core.windows.net/noob-queue'
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
