export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: string[];
  previewImages: string[];
  photos: string[];
  housingTypes: string[];
  amenities: string[];
  hostEmails: string[];
  coordinates: string[];
};

export function isMockServerData(data: unknown): data is MockServerData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const isStringArray = (arr: unknown): boolean => Array.isArray(arr) &&
    arr.every((item) => typeof item === 'string');

  return (
    'titles' in data && isStringArray(data.titles) &&
    'descriptions' in data && isStringArray(data.descriptions) &&
    'cities' in data && isStringArray(data.cities) &&
    'previewImages' in data && isStringArray(data.previewImages) &&
    'photos' in data && isStringArray(data.photos) &&
    'housingTypes' in data && isStringArray(data.housingTypes) &&
    'amenities' in data && isStringArray(data.amenities) &&
    'hostEmails' in data && isStringArray(data.hostEmails) &&
    'coordinates' in data && isStringArray(data.coordinates)
  );
}
