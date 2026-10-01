export const HOUSING_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;
export type HousingType = typeof HOUSING_TYPES[number];

export function takeHousingType(value: string): HousingType | undefined {
  return HOUSING_TYPES.find((type) => type === value);
}
