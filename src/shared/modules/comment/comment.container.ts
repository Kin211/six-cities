import { ContainerModule } from 'inversify';
import { Model } from 'mongoose';
import { Component } from '../../types/index.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentDocument, CommentModel } from './comment.model.js';

export function createCommentContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<CommentServiceInterface>(Component.CommentService)
      .to(DefaultCommentService)
      .inSingletonScope();

    bind<Model<CommentDocument>>(Component.CommentModel)
      .toConstantValue(CommentModel);
  });
}
