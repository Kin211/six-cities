import { CityName } from './city-name.type.js';
import { HousingType } from './housing-type.type.js';
import { Amenity } from './amenity.type.js';
import { Coordinates } from './coordinates.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: CityName;
  previewImage: string;
  photosLinks: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  bedrooms: number;
  maxGuests: number;
  price: number;
  amenities: Amenity[];
  host: User;
  commentsCount: number;
  location: Coordinates;
};
