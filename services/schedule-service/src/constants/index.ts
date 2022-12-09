export const BACKGROUND_JOB_MODULE = 'BACKGROUND_JOB_MODULE';
export const COMPOSER_MODULE = 'COMPOSER_MODULE';
export const SCHEDULE_MODULE = 'SCHEDULE_MODULE';

export const BACKGROUND_JOB_SERVICE_HOST = '192.168.1.103';
export const BACKGROUND_JOB_SERVICE_PORT = 5672;

export const COMPOSER_SERVICE_HOST = '192.168.1.103';
export const COMPOSER_SERVICE_PORT = 5672;

export const SCHEDULE_SERVICE_HOST = 'localhost';
export const SCHEDULE_SERVICE_PORT = 3003;

export const BACKGROUND_JOB_QUEUE = 'hcmue_background_job_queue';
export const COMPOSER_QUEUE = 'hcmue_composer_queue';

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

export const MULTER_DEST = '../../../../hcmue/static/uploads';

export const GENERATE_CREATE_SHEETS_CRON_JOB_TIME = '0 0 1 * * * ';
export const UNLINK_FILES_CRON_JOB_TIME = '0 0 2 * * *';
export const UPDATE_STATUS_SHEETS_CRON_JOB_TIME = '0 0 0 * * * ';
