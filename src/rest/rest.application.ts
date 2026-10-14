import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';

export class RestApplication {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config<RestSchema>,
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info(`Get value from env $SOLT: ${this.config.get('SALT')}`);
    this.logger.info(`Get value from env $PORT: ${this.config.get('DB_HOST')}`);
  }
}
