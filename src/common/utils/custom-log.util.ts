import { Logger } from '@nestjs/common';
import * as util from 'util';

export function CustomLog(
  level: 'log' | 'warn' | 'error' | 'debug' | 'verbose' = 'log',
  context: string = 'main',
  message: string,
  ...params: (string | number | object | undefined)[]
): void {
  const logger = new Logger(context);
  const formattedMessage = util.format(message, ...params);

  logger[level](formattedMessage);
}
