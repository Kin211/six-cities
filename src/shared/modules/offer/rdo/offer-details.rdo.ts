import { Expose, Type } from 'class-transformer';
import { Amenity, Coordinates } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { OfferRdo } from './offer.rdo.js';

export class OfferDetailsRdo extends OfferRdo {
  @Expose()
  public description!: string;

  @Expose()
  public photosLinks!: string[];

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxGuests!: number;

  @Expose()
  public amenities!: Amenity[];

  @Expose()
  @Type(() => UserRdo)
  public host!: UserRdo;

  @Expose()
  public location!: Coordinates;
}
