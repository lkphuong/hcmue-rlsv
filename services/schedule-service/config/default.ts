export default {
  MYSQL_TYPE: 'mysql',
  MYSQL_HOST: '103.154.176.80',
  MYSQL_PORT: 3306,
  MYSQL_DATABASE_NAME: 'hcmue_rlsv_v1',
  MYSQL_USERNAME: 'uat',
  MYSQL_PASSWORD: 'Uatvtcode@2022',

  MONGODB_URL:
    'mongodb://adminYouth:adminYouth2022@103.154.176.80:27072/youth-app-product?authMechanism=DEFAULT&authSource=youth-app-product',

  MONGODB_HOST: '103.154.176.80',
  MONGODB_PORT: 27072,
  MONGODB_USERNAME: 'adminYouth',
  MONGODB_PASSWORD: 'adminYouth2022',
  MOGODB_DATABASE_NAME: 'youth-app-product',

  SCHEDULE_SERVICE_HOST: 'localhost',
  SCHEDULE_SERVICE_PORT: 3003,

  LOGGING: ['query', 'error', 'info', 'warn'],
  LOGGER: 'file',

  ACCESS_SECRET_KEY: 'hcmue-rlsv@2022',
  REFRESH_SECRET_KEY: '@dm1nSp@ce123',
  ACCESS_TOKEN_EXPIRESIN: '1d',
  REFRESH_TOKEN_EXPIRESIN: '30 days',
  ITEMS_PER_PAGE: 10,

  MULTER_DEST: '../../../../hcmue/static/uploads',

  GENERATE_CREATE_SHEETS_CRON_JOB_TIME: '0 * * * * *',
  UPDATE_STATUS_SHEETS_CRON_JOB_TIME: '0 * * * * *',
  UNLINK_FILES_CRON_JOB_TIME: '0 2 * * * *',
};
