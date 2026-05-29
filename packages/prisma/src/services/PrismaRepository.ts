import { type PrismaDelegate } from '../models/PrismaDelegate.js';
import { type TypeMapModel } from '../models/TypeMapModel.js';
import { type TypeMapOperationKind } from '../models/TypeMapOperationKind.js';
import { BasePrismaService } from './BasePrismaService.js';

export abstract class PrismaRepository<
  TTypeMapModel extends TypeMapModel,
  TTransactionClient,
> extends BasePrismaService<PrismaDelegate<TTypeMapModel>, TTransactionClient> {
  public async create(
    args: TTypeMapModel['operations']['create']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['create']['result']> {
    return this.#invoke('create', args, transaction);
  }

  public async createMany(
    args: TTypeMapModel['operations']['createManyAndReturn']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['createManyAndReturn']['result']> {
    return this.#invoke('createManyAndReturn', args, transaction);
  }

  public async delete(
    args: TTypeMapModel['operations']['delete']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['delete']['result']> {
    return this.#invoke('delete', args, transaction);
  }

  public async deleteMany(
    args: TTypeMapModel['operations']['deleteMany']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['deleteMany']['result']> {
    return this.#invoke('deleteMany', args, transaction);
  }

  public async findFirst(
    args: TTypeMapModel['operations']['findFirst']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['findFirst']['result']> {
    return this.#invoke('findFirst', args, transaction);
  }

  public async findMany(
    args: TTypeMapModel['operations']['findMany']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['findMany']['result']> {
    return this.#invoke('findMany', args, transaction);
  }

  public async update(
    args: TTypeMapModel['operations']['update']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['update']['result']> {
    return this.#invoke('update', args, transaction);
  }

  public async updateManyAndReturn(
    args: TTypeMapModel['operations']['updateManyAndReturn']['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations']['updateManyAndReturn']['result']> {
    return this.#invoke('updateManyAndReturn', args, transaction);
  }

  async #invoke<TOperationKind extends TypeMapOperationKind>(
    operationKind: TOperationKind,
    args: TTypeMapModel['operations'][TOperationKind]['args'],
    transaction?: unknown,
  ): Promise<TTypeMapModel['operations'][TOperationKind]['result']> {
    const delegate: PrismaDelegate<TTypeMapModel> =
      await this._getDelegateFromWrapper(transaction);

    return delegate[operationKind](args);
  }
}
