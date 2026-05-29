import { type PrismaCreationDelegate } from '../models/PrismaCreationDelegate.js';
import { BasePrismaService } from './BasePrismaService.js';

export abstract class CreatePrismaService<
  TPrismaCreateArgs,
  TPrismaCreateManyArgs,
  TPrismaModel,
  TTransactionClient,
> extends BasePrismaService<
  PrismaCreationDelegate<
    TPrismaCreateArgs,
    TPrismaCreateManyArgs,
    TPrismaModel
  >,
  TTransactionClient
> {
  public async create(
    prismaCreateArgs: TPrismaCreateArgs,
    transaction?: unknown,
  ): Promise<TPrismaModel> {
    const delegate: PrismaCreationDelegate<
      TPrismaCreateArgs,
      TPrismaCreateManyArgs,
      TPrismaModel
    > = await this._getDelegateFromWrapper(transaction);

    return delegate.create(prismaCreateArgs);
  }

  public async createMany(
    prismaCreateManyArgs: TPrismaCreateManyArgs,
    transaction?: unknown,
  ): Promise<TPrismaModel[]> {
    const delegate: PrismaCreationDelegate<
      TPrismaCreateArgs,
      TPrismaCreateManyArgs,
      TPrismaModel
    > = await this._getDelegateFromWrapper(transaction);

    return delegate.createManyAndReturn(prismaCreateManyArgs);
  }
}
