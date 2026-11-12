import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferDocument } from './offer.model.js';
import { CityName } from '../../types/index.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<OfferDocument>;
  findById(offerId: string): Promise<OfferDocument | null>;
  find(count?: number): Promise<OfferDocument[]>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferDocument | null>;
  deleteById(offerId: string): Promise<OfferDocument | null>;
  findPremiumByCity(city: CityName): Promise<OfferDocument[]>;
  updateRating(offerId: string): Promise<OfferDocument | null>;
  exists(documentId: string): Promise<boolean>;
}
