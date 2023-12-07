FROM node:18@sha256:cd7fa8f136023f7500490e410ba70dd3982ccca21805264f2a260a3a97be7376

LABEL authors="oluwatobilobaaremu"

RUN apt-get update \
    && apt-get install -y wget gnupg \
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
ENV PUPPETEER_SKIP_DOWNLOAD=1
EXPOSE 3000

RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
