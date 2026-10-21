import { ContainerModule } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { Component } from '../shared/types/index.js';

export function createRestApplicationContainer(): ContainerModule {
  return new ContainerModule(({bind}) => {
    bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
    bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
    bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
    bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  });
}
