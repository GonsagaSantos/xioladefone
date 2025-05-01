FROM node:20


# Instalar dependências do Chromium
RUN apt-get update && apt-get install -y \
  libdrm2 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libnss3 \
  libgbm1 \
  libasound2 \
  libappindicator3-1 \
  fonts-liberation \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .


CMD ["node", "main.js"]
