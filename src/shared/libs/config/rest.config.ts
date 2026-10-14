import {Config} from './config.interface.js';
import {Logger} from '../logger/index.js';
import {configRestSchema, RestSchema} from './rest.schema.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) readonly logger: Logger
  ) {
    try {
      process.loadEnvFile();
      this.logger.info('.env file found and successfully parsed!');
    } catch {
      throw new Error('Can\'t read .env file. Perhaps the file does not exist.');
    }

    configRestSchema.load({});

    try {
      configRestSchema.validate({allowed: 'strict', output: this.logger.info});
    } catch (error) {
      this.logger.error('Config validation error:', error as Error); //неприятно, но пусть так
      throw new Error('Config validation error');
    }

    this.config = configRestSchema.getProperties();
    this.logger.info('Env variables successfully validated.');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
