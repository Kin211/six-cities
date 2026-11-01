import {Model} from 'mongoose';
import {UserServiceInterface} from './user-service.interface.js';
import {UserDocument, UserModel} from './user.model.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {Logger} from '../../libs/logger/index.js';
import { OfferDocument } from '../offer/offer.model.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { inject, injectable } from 'inversify';
import {Component} from '../../types/index.js';

@injectable()
export class DefaultUserService implements UserServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: Model<UserDocument> = UserModel
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

  public async updateById(userId: string, dto: UpdateUserDto): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { returnDocument: 'after' }).exec();
  }

  //TODO разобраться после разъяснений
  public async findFavorites(userId: string): Promise<OfferDocument[]> {
    const user = await this.userModel.findById(userId).populate<{ favoriteOffers: OfferDocument[] }>('favoriteOffers').exec();
    return user ? user.favoriteOffers : [];
  }

  public async addFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favoriteOffers: offerId }
    }).exec();
  }

  public async removeFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { favoriteOffers: offerId }
    }).exec();
  }
}
