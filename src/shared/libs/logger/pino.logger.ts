import {Logger as PinoInstance, pino, transport} from 'pino';
import {Logger} from './logger.interface.js';
import {getCurrentModuleDirectoryPath} from '../../helpers/index.js';
import { injectable } from 'inversify';
import { resolve } from 'node:path';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug'
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('PinoLogger created');
  }

  public debug(message: string, ...args: unknown[]): void {
    if (args.length > 0) {
      this.logger.debug({args}, message);
    } else {
      this.logger.debug(message);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (args.length > 0) {
      this.logger.info({args}, message);
    } else {
      this.logger.info(message);
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    if (args.length > 0) {
      this.logger.warn({args}, message);
    } else {
      this.logger.warn(message);
    }
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    if (args.length > 0) {
      this.logger.error({err: error, args}, message);
    } else {
      this.logger.error(error, message);
    }
  }
}
