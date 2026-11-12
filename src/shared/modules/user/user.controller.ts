import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkAuth });
    this.addRoute({ path: '/:userId/avatar', method: HttpMethod.Post, handler: this.uploadAvatar });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      this.send(res, StatusCodes.CONFLICT, { error: `Пользователь с email «${body.email}» уже существует.` });
      return;
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      this.send(res, StatusCodes.UNAUTHORIZED, { error: `Пользователь с email ${body.email} не найден.` });
      return;
    }

    this.send(res, StatusCodes.NOT_IMPLEMENTED, { message: 'Not implemented yet' });
  }

  public async checkAuth(_req: Request, res: Response): Promise<void> {
    this.send(res, StatusCodes.NOT_IMPLEMENTED, { message: 'Not implemented yet' });
  }

  public async uploadAvatar(
    req: Request<{userId: string}>,
    res: Response,
  ): Promise<void> {
    const { userId } = req.params;
    const updatedUser = await this.userService.updateById(userId, { avatarPath: req.body.avatarPath });
    this.created(res, fillDTO(UserRdo, updatedUser));
  }
}
