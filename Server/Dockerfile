FROM node:slim
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD false
LABEL authors="oluwatobilobaaremu"
RUN apt-get update && apt-get install gnupg wget -y && \
    wget https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots -O chromium.zip && \
    jar xvf chromium.zip && \
    ls &&\
    rm chromium.zip && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["npm", "start"]
