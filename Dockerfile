FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
COPY bin/ ./bin/
RUN npm run build
CMD ["node", "dist/index.js"]
