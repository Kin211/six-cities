import {Offer, takeAmenity, takeCityName, takeHousingType} from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    postDate,
    city,
    previewImage,
    photosLinks,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    amenities,
    hostEmail,
    commentsCount,
    location
  ] = offerData.replace('\n', '').split('\t');

  const parsedCity = takeCityName(city);
  if (parsedCity === undefined) {
    throw new Error(`Ошибка парсинга: неизвестный город "${city}"`);
  }

  const parsedType = takeHousingType(type);
  if (parsedType === undefined) {
    throw new Error(`Ошибка парсинга: неизвестный тип жилья "${type}"`);
  }

  const parsedAmenities = amenities.split(',').map((amenity) => {
    const trimmed = amenity.trim();
    const parsedAmenity = takeAmenity(trimmed);

    if (parsedAmenity === undefined) {
      throw new Error(`Ошибка парсинга: неизвестное удобство "${trimmed}"`);
    }

    return parsedAmenity;
  });

  const user = {
    email: hostEmail,
    password: '123',
    name: hostEmail.split('@')[0],
    userType: 'regular' as const,
    avatarPath: ''
  };

  const [latitude, longitude] = location.split(';');

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
    housingType: parsedType,
    bedrooms: Number.parseInt(bedrooms, 10),
    maxGuests: Number.parseInt(maxAdults, 10),
    price: Number.parseInt(price, 10),
    amenities: parsedAmenities,
    host: user,
    commentsCount: Number.parseInt(commentsCount, 10),
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    }
  };
}
