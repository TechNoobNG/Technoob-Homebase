FROM node:18

LABEL authors="oluwatobilobaaremu"

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y wget libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libpango-1.0-0 libcairo2 libasound2 unzip fastjar && \
    apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra


COPY . .

RUN ls -al

COPY .platform /app/.platform

COPY .ebextensions /app/.ebextensions

RUN npm install

ENV PORT=3000
EXPOSE 3000

USER node
CMD ["npm", "start"]
