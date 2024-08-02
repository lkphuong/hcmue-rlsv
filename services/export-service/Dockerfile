FROM node:16.15-alpine3.14 AS build

COPY . /src
WORKDIR /src

RUN yarn & yarn cache clean

FROM node:16.15.0-alpine3.14
COPY --from=build /src/package.json /opt/app/package.json
# COPY --from=build /src/.env /opt/app/.env
COPY --from=build /src/index.js /opt/app/index.js
COPY --from=build /src/config /opt/app/config
COPY --from=build /src/controllers /opt/app/controllers
COPY --from=build /src/resources /opt/app/resources
COPY --from=build /src/node_modules /opt/app/node_modules

WORKDIR /opt/app

# RUN npm i npm -g
RUN npm i pm2 -g

ENTRYPOINT ["pm2-runtime", "dist/src/index.js"]