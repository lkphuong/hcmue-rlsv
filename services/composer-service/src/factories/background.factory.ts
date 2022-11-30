import {
  DURABLE_QUEUE_OPTION,
  MAX_LENGTH_ARGUMENT,
  MESSAGE_TTL_ARGUMENT,
  NO_ACK_QUEUE,
  OVERFLOW_ARGUMENT,
  PERSISTENT_QUEUE,
  PREFETCH_COUNT_QUEUE,
  BACKGROUND_JOB_QUEUE,
  BACKGROUND_JOB_SERVICE_HOST,
  BACKGROUND_JOB_SERVICE_PORT,
  QUEUE_TYPE_ARGUMENT,
} from '../constants';

import { BACKGROUND_JOB_MODULE } from '../constants';

export const host =
  process.env.BACKGROUND_JOB_SERVICE_HOST || BACKGROUND_JOB_SERVICE_HOST;

export const port =
  parseInt(process.env.BACKGROUND_JOB_SERVICE_PORT) ||
  BACKGROUND_JOB_SERVICE_PORT;

export const queueName =
  process.env.BACKGROUND_JOB_QUEUE || BACKGROUND_JOB_QUEUE;

export const noAck = parseInt(process.env.NO_ACK_QUEUE) || NO_ACK_QUEUE;
export const persistent =
  parseInt(process.env.PERSISTENT_QUEUE) || PERSISTENT_QUEUE;

export const prefetchCount =
  parseInt(process.env.PREFETCH_COUNT_QUEUE) || PREFETCH_COUNT_QUEUE;

export const durable =
  parseInt(process.env.DURABLE_QUEUE_OPTION) || DURABLE_QUEUE_OPTION;

export const queue = process.env.QUEUE_TYPE_ARGUMENT || QUEUE_TYPE_ARGUMENT;

export const maxLength =
  parseInt(process.env.MAX_LENGTH_ARGUMENT) || MAX_LENGTH_ARGUMENT;

export const messageTTL =
  parseInt(process.env.MESSAGE_TTL_ARGUMENT) || MESSAGE_TTL_ARGUMENT;

export const overflow = process.env.OVERFLOW_ARGUMENT || OVERFLOW_ARGUMENT;

export const moduleName = BACKGROUND_JOB_MODULE;

export const backgroundFactory = {
  urls: [`amqp://${host}:${port}`],
  queue: queueName,
  exchange: {
    name: 'amq.direct', // put the name of the exchange
    type: 'direct', // the exchange type
    echangeOpts: {
      durable: false,
    },
  },
  // false = manual acknowledgement; true = automatic acknowledgment
  noAck: noAck !== 0 ? true : false,
  persistent: persistent !== 0 ? true : false,
  // Get one by one
  prefetchCount: prefetchCount,
  // https://amqp-node.github.io/amqplib/channel_api.html
  queueOptions: {
    durable: durable !== 0 ? true : false,
    arguments: {
      // 'x-expires': 1800000,
      'x-queue-type': queue,
      'x-max-length': maxLength,
      'x-message-ttl': messageTTL,
      'x-overflow': overflow,
    },
  },
};
