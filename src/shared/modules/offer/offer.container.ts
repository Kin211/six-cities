import { ContainerModule } from 'inversify';
import { Model } from 'mongoose';
import { Component } from '../../types/index.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferDocument, OfferModel } from './offer.model.js';

export function createOfferContainer(): ContainerModule {
  return new ContainerModule(({bind}) => {
    bind<OfferServiceInterface>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
    bind<Model<OfferDocument>>(Component.OfferModel).toConstantValue(OfferModel);
  });
}
