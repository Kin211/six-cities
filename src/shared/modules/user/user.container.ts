import { ContainerModule } from 'inversify';
import { Model } from 'mongoose';
import { Component } from '../../types/index.js';
import { UserServiceInterface } from './user-service.interface.js';
import { DefaultUserService } from './default-user.service.js';
import { UserDocument, UserModel } from './user.model.js';
import {Controller} from '../../libs/rest/index.js';
import {UserController} from './user.controller.js';

export function createUserContainer(): ContainerModule {
  return new ContainerModule(({bind}) => {
    bind<UserServiceInterface>(Component.UserService).to(DefaultUserService).inSingletonScope();
    bind<Model<UserDocument>>(Component.UserModel).toConstantValue(UserModel);
    bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  });
}
