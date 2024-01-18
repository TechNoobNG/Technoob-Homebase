FROM node:slim
LABEL authors="oluwatobilobaaremu"

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && \
    apt-get install -y libc6 && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y gnupg wget && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install
RUN npm i puppeteer

ENV PORT=3000
EXPOSE 3000

USER node
CMD ["npm", "start"]
