FROM node:18@sha256:cd7fa8f136023f7500490e410ba70dd3982ccca21805264f2a260a3a97be7376

LABEL authors="oluwatobilobaaremu"

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && service dbus start \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

WORKDIR /usr/src/app
COPY . .

RUN npm install

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

# Delete downloaded Chrome package
RUN rm -f /etc/apt/sources.list.d/google.list

RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
