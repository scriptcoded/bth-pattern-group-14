# build stage
FROM node:14-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

# production stage
FROM codecentric/single-page-application-server as production-stage

COPY --from=build-stage /app/dist /app

EXPOSE 80
