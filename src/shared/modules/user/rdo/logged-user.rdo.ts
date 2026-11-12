import { Expose } from 'class-transformer';
import { UserRdo } from './user.rdo.js';

export class LoggedUserRdo extends UserRdo {
  @Expose()
  public token!: string;
}
