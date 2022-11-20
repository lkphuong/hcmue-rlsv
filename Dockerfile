FROM node:16.15-alpine3.14 AS build

COPY . /src
WORKDIR /src

RUN yarn & yarn cache clean

FROM node:16.15.0-alpine3.14
COPY --from=build /src/package.json /opt/app/package.json
COPY --from=build /src/tsconfig.json /opt/app/tsconfig.json
COPY --from=build /src/.eslintrc.js /opt/app/.eslintrc.js
COPY --from=build /src/.prettierrc /opt/app/.prettierrc
COPY --from=build /src/config /opt/app/config
COPY --from=build /src/dist /opt/app/dist
COPY --from=build /src/node_modules /opt/app/node_modules

RUN mkdir /opt/app/logs
RUN mkdir /opt/app/static

WORKDIR /opt/app

ENV NODE_ENV='development'
ENV MYSQL_HOST='103.154.176.80'
ENV MYSQL_PORT=3306
ENV MYSQL_DATABASE_NAME='hcmue_rlsv'
ENV MYSQL_USERNAME='uat'
ENV MYSQL_PASSWORD='Uatvtcode@2022'

ENV MONGODB_URL='mongodb://adminYouth:adminYouth2022@103.154.176.80:27072/youth-app-product?authMechanism=DEFAULT&authSource=youth-app-product'

ENV MONGODB_HOST='103.154.176.80'
ENV MONGODB_PORT=27072
ENV MONGODB_USERNAME='adminYouth'
ENV MONGODB_PASSWORD='adminYouth2022'
ENV MOGODB_DATABASE_NAME='youth-app-product'

ENV ACCESS_SECRET_KEY='@dm1n123'
ENV REFRESH_SECRET_KEY='@dm1nSp@ce123'
ENV ACCESS_TOKEN_EXPIRESIN='1d'
ENV REFRESH_TOKEN_EXPIRESIN='30 days'
ENV ITEMS_PER_PAGE=10
ENV BASE_URL='http://localhost:9091/'

ENV MULTER_DEST='./static/uploads'
ENV IMAGE_PATH='./static/resources'

EXPOSE 3000

RUN npm i npm -g
RUN npm i pm2 -g

ENTRYPOINT ["pm2-runtime", "dist/src/main.js"]