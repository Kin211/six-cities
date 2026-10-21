import { CreateUserDto } from './dto/create-user.dto.js';
import { UserDocument } from './user.model.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<UserDocument>;
  findById(userId: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDocument>;
}
