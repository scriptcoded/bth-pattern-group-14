# build stage
FROM node:14-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma/ prisma/

RUN npx prisma generate

# production stage
FROM node:14-alpine as production-stage
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY --from=build-stage /app/prisma /app/prisma
COPY --from=build-stage /app/node_modules/.prisma /app/node_modules/.prisma

COPY . .

EXPOSE 4000
CMD ["npm", "run", "start"]
