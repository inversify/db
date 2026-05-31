import { type OperationKind } from '../models/OperationKind.js';
import { type Parameter } from '../models/Parameter.js';
import { type PrismaDelegate } from '../models/PrismaDelegate.js';
import { BasePrismaService } from './BasePrismaService.js';

export abstract class PrismaRepository<
  TDelegate extends Record<
    OperationKind,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => Promise<unknown>
  >,
  TTransactionClient,
> extends BasePrismaService<PrismaDelegate<TDelegate>, TTransactionClient> {
  public create(
    args: Parameter<TDelegate['create']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['create']> {
    return this.#invoke('create', args, transaction);
  }

  public createManyAndReturn(
    args: Parameter<TDelegate['createManyAndReturn']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['createManyAndReturn']> {
    return this.#invoke('createManyAndReturn', args, transaction);
  }

  public delete(
    args: Parameter<TDelegate['delete']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['delete']> {
    return this.#invoke('delete', args, transaction);
  }

  public deleteMany(
    args: Parameter<TDelegate['deleteMany']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['deleteMany']> {
    return this.#invoke('deleteMany', args, transaction);
  }

  public findFirst(
    args: Parameter<TDelegate['findFirst']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['findFirst']> {
    return this.#invoke('findFirst', args, transaction);
  }

  public findMany(
    args: Parameter<TDelegate['findMany']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['findMany']> {
    return this.#invoke('findMany', args, transaction);
  }

  public update(
    args: Parameter<TDelegate['update']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['update']> {
    return this.#invoke('update', args, transaction);
  }

  public updateManyAndReturn(
    args: Parameter<TDelegate['updateManyAndReturn']>,
    transaction?: unknown,
  ): ReturnType<TDelegate['updateManyAndReturn']> {
    return this.#invoke('updateManyAndReturn', args, transaction);
  }

  #flattenPromiseAwaitedPromise<T extends Promise<unknown>>(
    promise: Promise<Awaited<T>>,
  ): T {
    return promise as T;
  }

  async #innerInvoke<TOperationKind extends OperationKind>(
    operationKind: TOperationKind,
    args: Parameters<TDelegate[TOperationKind]>[0],
    transaction?: unknown,
  ): Promise<Awaited<ReturnType<TDelegate[TOperationKind]>>> {
    const delegate: PrismaDelegate<TDelegate> =
      await this._getDelegateFromWrapper(transaction);

    return await delegate[operationKind](args);
  }

  #invoke<TOperationKind extends OperationKind>(
    operationKind: TOperationKind,
    args: Parameters<TDelegate[TOperationKind]>[0],
    transaction?: unknown,
  ): ReturnType<TDelegate[TOperationKind]> {
    return this.#flattenPromiseAwaitedPromise(
      this.#innerInvoke(operationKind, args, transaction),
    );
  }
}
