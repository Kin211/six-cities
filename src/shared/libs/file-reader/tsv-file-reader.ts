import {FileReader} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {Offer, takeAmenity, takeCityName, takeHousingType} from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, previewImage, photosLinks, isPremium, isFavorite, rating, housingType,
        bedrooms, maxGuests, price, amenities, host, commentsCount, location]) => {

        const parsedCity = takeCityName(city);
        if (parsedCity === undefined) {
          throw new Error(`Ошибка парсинга: неизвестный город "${city}"`);
        }

        const parsedHousingType = takeHousingType(housingType);
        if (parsedHousingType === undefined) {
          throw new Error(`Ошибка парсинга: неизвестный тип жилья "${housingType}"`);
        }

        const parsedAmenities = amenities.split(',').map((amenity) => {
          const trimmed = amenity.trim();
          const parsedAmenity = takeAmenity(trimmed);
          if (parsedAmenity === undefined) {
            throw new Error(`Ошибка парсинга: неизвестное удобство "${trimmed}"`);
          }

          return parsedAmenity;
        });

        return {
          title,
          description,
          postDate: new Date(postDate),
          city: parsedCity,


          previewImage,
          photosLinks: photosLinks.split(',').map((photo) => photo.trim()),
          isPremium: isPremium.toLowerCase() === 'true',
          isFavorite: isFavorite.toLowerCase() === 'true',
          rating: Number.parseFloat(rating),
          housingType: parsedHousingType,
          bedrooms: Number.parseInt(bedrooms, 10),
          maxGuests: Number.parseInt(maxGuests, 10),
          price: Number.parseInt(price, 10),
          amenities: parsedAmenities,
          host: {
            email: host,
            name: '',
            userType: 'regular',
            password: '123',
            avatarPath: 'example.jpg',
          },
          commentsCount: Number.parseInt(commentsCount, 10),
          location: {
            latitude: Number.parseFloat(location.split(';')[0]),
            longitude: Number.parseFloat(location.split(';')[1])
          }
        };
      });
  }
}
