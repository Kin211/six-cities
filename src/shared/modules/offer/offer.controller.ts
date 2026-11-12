import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {BaseController, HttpError, HttpMethod, RequestBody, RequestParams} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import {CityName, Component} from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { UserServiceInterface } from '../user/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferDetailsRdo } from './rdo/offer-details.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.toggleFavorite });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferDetailsRdo, result));
  }

  public async show(
    { params }: Request<{offerId: string}>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Предложение с id ${offerId} не найдено.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferDetailsRdo, offer));
  }

  public async update(
    { body, params }: UpdateOfferRequest,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Предложение с id ${params.offerId} не найдено.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferDetailsRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<{offerId: string}>,
    res: Response,
  ): Promise<void> {
    const deletedOffer = await this.offerService.deleteById(params.offerId);

    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Предложение с id ${params.offerId} не найдено.`,
        'OfferController'
      );
    }

    this.noContent(res);
  }

  public async getPremium(
    { params }: Request<{city: CityName}>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavorites(
    { body }: Request<RequestParams, RequestBody, { userId: string }>,
    res: Response,
  ): Promise<void> {
    const offers = await this.userService.findFavorites(body.userId);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async toggleFavorite(
    req: Request<{offerId: string}, RequestBody, { userId: string; status: number }>,
    res: Response,
  ): Promise<void> {
    const { offerId } = req.params;
    const { userId, status } = req.body;

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Предложение с id ${offerId} не найдено.`,
        'OfferController'
      );
    }

    if (status === 1) { //TODO подстроить под фронт в будущем
      await this.userService.addFavorite(userId, offerId);
    } else {
      await this.userService.removeFavorite(userId, offerId);
    }

    const offer = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferDetailsRdo, offer));
  }
}
