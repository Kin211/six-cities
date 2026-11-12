import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export type UpdateOfferRequest = Request<{offerId: string}, RequestBody, UpdateOfferDto>;
