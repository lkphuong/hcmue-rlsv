import {
  DURABLE_QUEUE_OPTION,
  MAX_LENGTH_ARGUMENT,
  MESSAGE_TTL_ARGUMENT,
  NO_ACK_QUEUE,
  OVERFLOW_ARGUMENT,
  PERSISTENT_QUEUE,
  PREFETCH_COUNT_QUEUE,
  COMPOSER_QUEUE,
  QUEUE_TYPE_ARGUMENT,
  COMPOSER_SERVICE_HOST,
  COMPOSER_SERVICE_PORT,
} from '../constants';

import { COMPOSER_MODULE } from '../constants';

export const host = process.env.COMPOSER_SERVICE_HOST || COMPOSER_SERVICE_HOST;

export const port =
  parseInt(process.env.COMPOSER_SERVICE_PORT) || COMPOSER_SERVICE_PORT;

export const queueName = process.env.COMPOSER_QUEUE || COMPOSER_QUEUE;
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

export const moduleName = COMPOSER_MODULE;

console.log('host: ', host);
console.log('port: ', port);
console.log('queueName: ', queueName);

export const composerFactory = {
  urls: [`amqp://${host}:${port}`],
  queue: queueName,
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
