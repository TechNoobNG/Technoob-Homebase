FROM node:slim
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD false
LABEL authors="oluwatobilobaaremu"

RUN apt-get update && apt-get install gnupg wget libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libpango-1.0-0 libcairo2 libasound2 unzip fastjar -y

WORKDIR /usr/src/app

RUN wget https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots -O chromium.zip && \
    unzip chromium.zip -d chromium && \
    rm chromium.zip

COPY . .

RUN npm install

ENV PORT=3000
EXPOSE 3000

USER node
CMD ["npm", "start"]
