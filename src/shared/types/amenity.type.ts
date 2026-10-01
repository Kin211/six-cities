export const AMENITIES = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace',
  'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;
export type Amenity = typeof AMENITIES[number];

export function takeAmenity(value: string): Amenity | undefined {
  return AMENITIES.find((amenity) => amenity === value);
}
