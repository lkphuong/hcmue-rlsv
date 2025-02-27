export const AUTH_MODULE = 'AUTH_MODULE';
export const BACKGROUND_JOB_MODULE = 'BACKGROUND_JOB_MODULE';
export const COMPOSER_MODULE = 'COMPOSER_MODULE';
export const NOTIFICATION_MODULE = 'NOTIFICATION_MODULE';
export const REDIS_MODULE = 'REDIS_MODULE';
export const SCHEDULE_MODULE = 'SCHEDULE_MODULE';

export const STATIC_PATH = '../../../static';
export const APP_PREFIX = 'hcmue';
export const UPLOAD_DEST = 'uploads';

export const LOG_PATH = './logs';

export const LOG_RETENTION_DURATION = 31;

export const SPECIAL_ALPHABEL_REGEX = /[ `!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/;
export const NORMAL_ALPHABEL_REGEX = /^[A-Za-z0-9-_\s]+$/;

export const MOBILE_REGEX = /^[0-9]{10,11}$/;
export const CODE_REGEX = /^([A-Za-z0-9]{1,})(\.([A-Za-z0-9]{1,})){0,}$/i;

export const MAX_OF_QUANTITY = 2000000000;
export const MAX_PRICE = 9999999999;

export const TIME_REGEX = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

export const MAX_FILES = 5;

export const DATABASE = {
  MYSQL_TYPE: 'mysql',
  MYSQL_HOST: '103.154.176.80',
  MYSQL_PORT: 3306,
  MYSQL_DATABASE_NAME: 'hcmue_rlsv',
  MYSQL_USERNAME: 'uat',
  MYSQL_PASSWORD: 'Uatvtcode@2022',
};
