import { UserType } from '../../../types/index.js';

export class UpdateUserDto {
  public name?: string;
  public avatarPath?: string;
  public userType?: UserType;
}
