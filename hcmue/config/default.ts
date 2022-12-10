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

  ACCESS_SECRET_KEY: 'hcmue-rlsv@2022',
  REFRESH_SECRET_KEY: '@dm1nSp@ce123',
  ACCESS_TOKEN_EXPIRESIN: '1d',
  REFRESH_TOKEN_EXPIRESIN: '30 days',
  ITEMS_PER_PAGE: 10,

  BASE_URL: 'http://103.154.176.80:3020/uploads/',

  MAX_FILE_SIZE_NAME: '10MiB',
  MAX_FILE_SIZE_VALUE: 10 * 1024 * 1024,
  MAX_FIELD_SIZE_VALUE: 1 * 1024 * 1024,
  EXTENSION_NAMES: 'pdf, jpg, jpeg, png',
  EXTENSION_VALUES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],

  STATIC_PATH: '../../../static',
  MULTER_DEST: './static/uploads',
};
