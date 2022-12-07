export const AUTH_MODULE = 'AUTH_MODULE';
export const BACKGROUND_JOB_MODULE = 'BACKGROUND_JOB_MODULE';
export const COMPOSER_MODULE = 'COMPOSER_MODULE';
export const NOTIFICATION_MODULE = 'NOTIFICATION_MODULE';
export const REDIS_MODULE = 'REDIS_MODULE';
export const SCHEDULE_MODULE = 'SCHEDULE_MODULE';

export const AUTH_SERVICE_HOST = 'localhost';
export const AUTH_SERVICE_PORT = 9092;

export const BACKGROUND_JOB_SERVICE_HOST = 'localhost';
export const BACKGROUND_JOB_SERVICE_PORT = 5672;

export const COMPOSER_SERVICE_HOST = 'localhost';
export const COMPOSER_SERVICE_PORT = 5672;

export const NOTIFICATION_SERVICE_HOST = 'localhost';
export const NOTIFICATION_SERVICE_PORT = 5672;

export const REDIS_SERVICE_HOST = 'localhost';
export const REDIS_SERVICE_PORT = 6379;

export const SCHEDULE_SERVICE_HOST = 'localhost';
export const SCHEDULE_SERVICE_PORT = 9093;

export const BACKGROUND_JOB_QUEUE = 'asset_background_job_queue';
export const COMPOSER_QUEUE = 'asset_composer_queue';
export const NOTIFICATION_QUEUE = 'asset_notification_queue';

export const APP_PREFIX = 'hcmue';
export const UPLOAD_DEST = 'uploads';

export const LOG_PATH = './logs';
export const LOG_RETENTION_DURATION = 31;

export const TTL = 120;
export const NO_ACK_QUEUE = 0;
export const PERSISTENT_QUEUE = 1;
export const PREFETCH_COUNT_QUEUE = 1;
export const DURABLE_QUEUE_OPTION = 1;
export const QUEUE_EXPIRED_ARGUMENT = 1800000;
export const QUEUE_TYPE_ARGUMENT = 'quorum';
export const MAX_LENGTH_ARGUMENT = 1000; // maximum number of messages in queue
export const MESSAGE_TTL_ARGUMENT = 60000; // 60s

export const SPECIAL_ALPHABEL_REGEX = /[ `!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/;
export const NORMAL_ALPHABEL_REGEX = /^[A-Za-z0-9-_\s]+$/;

export const MOBILE_REGEX = /^[0-9]{10,11}$/;
export const CODE_REGEX = /^([A-Za-z0-9]{1,})(\.([A-Za-z0-9]{1,})){0,}$/i;

export const MAX_OF_QUANTITY = 2000000000;
export const MAX_PRICE = 9999999999;

export const TIME_REGEX = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
