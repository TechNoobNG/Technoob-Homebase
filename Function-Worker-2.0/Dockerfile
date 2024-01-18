# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node18-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node18

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

RUN apt-get update && \
    apt-get install -y wget libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libpango-1.0-0 libcairo2 libasound2 unzip fastjar && \
    apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra

WORKDIR /home/site/wwwroot
COPY . /home/site/wwwroot
RUN ls

RUN npm i

