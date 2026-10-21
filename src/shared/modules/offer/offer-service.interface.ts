import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferDocument } from './offer.model.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<OfferDocument>;
  findById(offerId: string): Promise<OfferDocument | null>;
}
