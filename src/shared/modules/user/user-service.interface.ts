import { CreateUserDto } from './dto/create-user.dto.js';
import { UserDocument } from './user.model.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {OfferDocument} from '../offer/index.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<UserDocument>;
  findById(userId: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDocument>;
  updateById(userId: string, dto: UpdateUserDto): Promise<UserDocument | null>;

  findFavorites(userId: string): Promise<OfferDocument[]>; //TODO разобраться после разъяснений
  addFavorite(userId: string, offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
}
