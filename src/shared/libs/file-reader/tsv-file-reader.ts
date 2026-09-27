import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import {Offer, HousingType, CityName, Amenity} from '../../types';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, previewImage, photosLinks, isPremium, isFavorite, rating, housingType, bedrooms, maxGuests, price, amenities, host, commentsCount, location]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: city as CityName,
        previewImage,
        photosLinks: photosLinks.split(',').map((photo) => photo.trim()),
        isPremium: isPremium.toLowerCase() === 'true',
        isFavorite: isFavorite.toLowerCase() === 'true',
        rating: Number.parseFloat(rating),
        housingType: housingType as HousingType,
        bedrooms: Number.parseInt(bedrooms, 10),
        maxGuests: Number.parseInt(maxGuests, 10),
        price: Number.parseInt(price, 10),
        amenities: amenities.split(',').map((amenity) => amenity.trim() as Amenity),
        host: {
          email: host,
          name: '',
          userType: 'regular',
          password: '123',
          avatarPath: 'example.jpg', //здесь всё в качестве заглушек из-за недостатка инфы в формате предложений
        },
        commentsCount: Number.parseInt(commentsCount, 10),
        location: {
          latitude: Number.parseFloat(location.split(',')[0]),
          longitude: Number.parseFloat(location.split(',')[1])
        }
      }));
  }
}
