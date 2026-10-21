import { Model } from 'mongoose';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferDocument, OfferModel } from './offer.model.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import {Logger} from '../../libs/logger/index.js';

export class DefaultOfferService implements OfferServiceInterface {
  constructor(
    private readonly logger: Logger,
    private readonly offerModel: Model<OfferDocument> = OfferModel
  ) {}

  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    const result = await this.offerModel.create({
      ...dto,
      host: dto.userId,
    });

    this.logger.info(`Создано новое предложение об аренде: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string): Promise<OfferDocument | null> {
    return this.offerModel
      .findById(offerId)
      .populate('host')
      .exec();
  }
}
