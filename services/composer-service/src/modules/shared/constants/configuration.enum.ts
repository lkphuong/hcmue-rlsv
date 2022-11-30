export enum Configuration {
  MYSQL_TYPE = 'MYSQL_TYPE',
  MYSQL_HOST = 'MYSQL_HOST',
  MYSQL_PORT = 'MYSQL_PORT',
  MYSQL_DATABASE_NAME = 'MYSQL_DATABASE_NAME',
  MYSQL_USERNAME = 'MYSQL_USERNAME',
  MYSQL_PASSWORD = 'MYSQL_PASSWORD',

  MONGODB_URL = 'MONGODB_URL',
  MONGODB_HOST = 'MONGODB_HOST',
  MONGODB_PORT = 'MONGODB_PORT',
  MONGODB_USERNAME = 'MONGODB_USERNAME',
  MONGODB_PASSWORD = 'MONGODB_PASSWORD',
  MOGODB_DATABASE_NAME = 'MOGODB_DATABASE_NAME',
  LOGGING = 'LOGGING',
  LOGGER = 'LOGGER',

  ACCESS_SECRET_KEY = 'ACCESS_SECRET_KEY',
  REFRESH_SECRET_KEY = 'REFRESH_SECRET_KEY',
  ACCESS_TOKEN_EXPIRESIN = 'ACCESS_TOKEN_EXPIRESIN',
  REFRESH_TOKEN_EXPIRESIN = 'REFRESH_TOKEN_EXPIRESIN',
  ITEMS_PER_PAGE = 'ITEMS_PER_PAGE',

  MAX_TIMES = 'MAX_TIMES',

  COMPOSER_MODULE = 'COMPOSER_MODULE',

  TTL = 'TTL',
  NO_ACK_QUEUE = 'NO_ACK_QUEUE',
  PERSISTENT_QUEUE = 'PERSISTENT_QUEUE',
  PREFETCH_COUNT_QUEUE = 'PREFETCH_COUNT_QUEUE',
  DURABLE_QUEUE_OPTION = 'DURABLE_QUEUE_OPTION',
  QUEUE_EXPIRED_ARGUMENT = 'QUEUE_EXPIRED_ARGUMENT',
  MAX_LENGTH_ARGUMENT = 'MAX_LENGTH_ARGUMENT', // maximum number of messages in queue
  MESSAGE_TTL_ARGUMENT = 'MESSAGE_TTL_ARGUMENT', // 60s
  OVERFLOW_ARGUMENT = 'OVERFLOW_ARGUMENT',
}
