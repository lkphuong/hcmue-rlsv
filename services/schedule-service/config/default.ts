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

  BACKGROUND_JOB_QUEUE: 'hcmue_background_job_queue',
  COMPOSER_QUEUE: 'hcmue_composer_queue',

  TTL: 120,
  NO_ACK_QUEUE: 0,
  PERSISTENT_QUEUE: 1,
  PREFETCH_COUNT_QUEUE: 1,
  DURABLE_QUEUE_OPTION: 1,
  QUEUE_EXPIRED_ARGUMENT: 1800000,
  QUEUE_TYPE_ARGUMENT: 'quorum',
  MAX_LENGTH_ARGUMENT: 1000, // maximum number of messages in queu,
  MESSAGE_TTL_ARGUMENT: 60000, // 60,
  OVERFLOW_ARGUMENT: 'reject-publish',

  GENERATE_CREATE_SHEETS_CRON_JOB_TIME: '0 * * * * *',
  UPDATE_STATUS_SHEETS_CRON_JOB_TIME: '0 */15 * * * *',
  UNLINK_FILES_CRON_JOB_TIME: '0 0 0 * * *',
};
