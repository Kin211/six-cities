import {inject, injectable} from 'inversify';
import {Model} from 'mongoose';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentDocument} from './comment.model.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {OfferServiceInterface} from '../offer/index.js';

const DEFAULT_COMMENT_LIMIT = 50;

@injectable()
export class DefaultCommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: Model<CommentDocument>,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface
  ) {
  }

  public async create(dto: CreateCommentDto): Promise<CommentDocument> {
    const comment = await this.commentModel.create({
      text: dto.text,
      rating: dto.rating,
      offerId: dto.offerId,
      author: dto.userId,
    });

    await this.offerService.updateRating(dto.offerId);

    this.logger.info(`Добавлен новый комментарий и обновлен рейтинг предложения: ${dto.offerId}`);
    return comment.populate('author');
  }

  public async findByOfferId(offerId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: -1})
      .limit(DEFAULT_COMMENT_LIMIT)
      .populate('author')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({offerId}).exec();
    return result.deletedCount;
  }
}
