import {inject, injectable} from 'inversify';
import {Model, Types, PipelineStage} from 'mongoose';
import {Component, CityName} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {OfferDocument} from './offer.model.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {CommentDocument} from '../comment/index.js';

const DEFAULT_OFFER_COUNT = 60;
const PREMIUM_OFFER_COUNT = 3;

@injectable()
export class DefaultOfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: Model<OfferDocument>,
    @inject(Component.CommentModel) private readonly commentModel: Model<CommentDocument>
  ) {
  }

  private get offerPipeline(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'comments',
          let: {offerId: '$_id'},
          pipeline: [
            {$match: {$expr: {$eq: ['$offerId', '$$offerId']}}},
            {$project: {_id: 0, rating: 1}},
          ],
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'host',
          foreignField: '_id',
          as: 'host',
        },
      },
      {
        $unwind: {
          path: '$host',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {
            $cond: {
              if: {$gt: [{$size: '$comments'}, 0]},
              then: {$round: [{$avg: '$comments.rating'}, 1]},
              else: {$ifNull: ['$rating', 1]},
            },
          },
        },
      },
      {
        $unset: 'comments',
      },
    ];
  }


  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    const newOffer = await this.offerModel.create({
      ...dto,
      host: dto.userId,
    });
    this.logger.info(`Создано новое предложение: ${dto.title}`);
    const offer = await this.findById(newOffer.id);

    if (!offer) {
      throw new Error(`Не удалось получить созданное предложение с id: ${newOffer.id}`);
    }

    return offer;
  }

  public async findById(offerId: string): Promise<OfferDocument | null> {
    const [offer] = await this.offerModel
      .aggregate<OfferDocument>([
        {$match: {_id: new Types.ObjectId(offerId)}},
        ...this.offerPipeline,
      ])
      .exec();

    return offer ?? null;
  }

  public async find(count = DEFAULT_OFFER_COUNT): Promise<OfferDocument[]> {
    return this.offerModel
      .aggregate<OfferDocument>([
        ...this.offerPipeline,
        {$sort: {createdAt: -1}},
        {$limit: count},
      ])
      .exec();
  }

  public async findPremiumByCity(city: CityName): Promise<OfferDocument[]> {
    return this.offerModel
      .aggregate<OfferDocument>([
        {$match: {city, isPremium: true}},
        ...this.offerPipeline,
        {$sort: {createdAt: -1}},
        {$limit: PREMIUM_OFFER_COUNT},
      ])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferDocument | null> {
    await this.offerModel.findByIdAndUpdate(offerId, dto, {returnDocument: 'after'}).exec();
    return this.findById(offerId);
  }

  public async deleteById(offerId: string): Promise<OfferDocument | null> {
    const deletedOffer = await this.offerModel.findByIdAndDelete(offerId).exec();

    if (deletedOffer) {
      await this.commentModel.deleteMany({offerId}).exec();
      this.logger.info(`Предложение ${offerId} и все его комментарии успешно удалены.`);
    }

    return deletedOffer;
  }

  public async updateRating(offerId: string): Promise<OfferDocument | null> {
    // Агрегация по всем существующим комментариям этого предложения
    const [result] = await this.commentModel.aggregate<{ rating: number; commentsCount: number }>([
      {$match: {offerId: new Types.ObjectId(offerId)}},
      {
        $group: {
          _id: '$offerId',
          rating: {$avg: '$rating'},
          commentsCount: {$sum: 1},
        },
      },
    ]).exec();

    const rating = result ? Number(result.rating.toFixed(1)) : 1;
    const commentsCount = result ? result.commentsCount : 0;

    return this.offerModel.findByIdAndUpdate(offerId, {
      rating,
      commentsCount,
    }, {new: true}).exec();
  }
}
