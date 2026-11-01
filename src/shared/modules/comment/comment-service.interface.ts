import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentDocument } from './comment.model.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<CommentDocument>;
  findByOfferId(offerId: string): Promise<CommentDocument[]>;
  deleteByOfferId(offerId: string): Promise<number>; //не факт, что пригодится, но пусть будет
}
