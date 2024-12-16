FROM node:16.15-alpine3.14 AS build

WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

COPY . .

FROM node:16.15-alpine3.14

WORKDIR /opt/app
COPY --from=build /src/package.json /opt/app/
COPY --from=build /src/.env /opt/app/
COPY --from=build /src/index.js /opt/app/
COPY --from=build /src/config /opt/app/config/
COPY --from=build /src/controllers /opt/app/controllers/
COPY --from=build /src/resources /opt/app/resources/
COPY --from=build /src/node_modules /opt/app/node_modules/

RUN npm install pm2 -g

ENTRYPOINT ["pm2-runtime", "index.js"]
