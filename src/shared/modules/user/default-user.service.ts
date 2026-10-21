import {Model} from 'mongoose';
import {UserServiceInterface} from './user-service.interface.js';
import {UserDocument, UserModel} from './user.model.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {Logger} from '../../libs/logger/index.js';

export class DefaultUserService implements UserServiceInterface {
  constructor(
    private readonly logger: Logger,
    private readonly userModel: Model<UserDocument> = UserModel
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<UserDocument> {
    const user = new this.userModel(dto);
    user.setPassword(dto.password, salt);

    const result = await user.save();
    this.logger.info(`Создан новый пользователь: ${user.email}`);

    return result;
  }

  public async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDocument> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
