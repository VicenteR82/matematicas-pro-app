FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY --from=builder /app/dist ./dist

RUN npm install express

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]