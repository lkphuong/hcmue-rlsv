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

  LOGGING: ['query', 'error', 'info', 'warn'],
  LOGGER: 'file',

  ITEMS_PER_PAGE: 10,

  MULTER_DEST: './static/uploads',

  BACKGROUND_JOB_SERVICE_HOST: 'localhost',
  BACKGROUND_JOB_SERVICE_PORT: 5672,

  COMPOSER_SERVICE_HOST: 'localhost',
  COMPOSER_SERVICE_PORT: 5672,

  SCHEDULE_SERVICE_HOST: 'localhost',
  SCHEDULE_SERVICE_PORT: 3003,

  GENERATE_CREATE_SHEETS_CRON_JOB_TIME: '0 0 0 * * *',
  UPDATE_STATUS_SHEETS_CRON_JOB_TIME: '0 0 0 * * *',
  UNLINK_FILES_CRON_JOB_TIME: '0 0 2 * * *',
};
