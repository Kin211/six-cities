import { CityName, HousingType, Amenity, Coordinates } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate?: Date;
  public city!: CityName;
  public previewImage!: string;
  public photosLinks!: string[];
  public isPremium!: boolean;
  public housingType!: HousingType;
  public bedrooms!: number;
  public maxGuests!: number;
  public price!: number;
  public amenities!: Amenity[];
  public location!: Coordinates;
  public userId!: string;
}
