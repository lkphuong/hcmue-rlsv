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
ENV MYSQL_DATABASE_NAME='hcmue_rlsv_v1'
ENV MYSQL_USERNAME='uat'
ENV MYSQL_PASSWORD='Uatvtcode@2022'

ENV MONGODB_URL='mongodb://adminYouth:adminYouth2022@103.154.176.80:27072/youth-app-product?authMechanism=DEFAULT&authSource=youth-app-product'

ENV MONGODB_HOST='103.154.176.80'
ENV MONGODB_PORT=27072
ENV MONGODB_USERNAME='adminYouth'
ENV MONGODB_PASSWORD='adminYouth2022'
ENV MOGODB_DATABASE_NAME='youth-app-product'

ENV BACKGROUND_JOB_SERVICE_HOST='localhost'
ENV BACKGROUND_JOB_SERVICE_PORT=5672

ENV TRACKING_SERVICE_HOST='localhost'
ENV TRACKING_SERVICE_PORT=5672

ENV BACKGROUND_JOB_QUEUE='hcmue_background_job_queue'
ENV TRACKING_QUEUE='hcmue_tracking_queue'

ENV TTL=120
ENV NO_ACK_QUEUE=0
ENV PERSISTENT_QUEUE=1
ENV PREFETCH_COUNT_QUEUE=1
ENV DURABLE_QUEUE_OPTION=1
ENV QUEUE_EXPIRED_ARGUMENT=1800000
ENV QUEUE_TYPE_ARGUMENT='quorum'
ENV MAX_LENGTH_ARGUMENT=1000
ENV MESSAGE_TTL_ARGUMENT=60000
ENV OVERFLOW_ARGUMENT='reject-publish'

RUN npm i npm -g
RUN npm i pm2 -g

ENTRYPOINT ["pm2-runtime", "dist/src/main.js"]