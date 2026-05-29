import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper.js';

export abstract class BasePrismaService<TDelegate, TTransactionClient> {
  protected readonly _delegate: TDelegate;

  constructor(delegate: TDelegate) {
    this._delegate = delegate;
  }

  protected async _getDelegateFromWrapper(
    transaction?: unknown,
  ): Promise<TDelegate> {
    if (transaction === undefined) {
      return this._delegate;
    }

    return this._getDelegate(await this.#getTransactionClient(transaction));
  }

  async #getTransactionClient(
    transaction: unknown,
  ): Promise<TTransactionClient> {
    if (PrismaTransactionWrapper.is<TTransactionClient>(transaction)) {
      return transaction.unwrap();
    }

    return transaction as TTransactionClient;
  }

  protected abstract _getDelegate(
    transactionClient: TTransactionClient,
  ): TDelegate;
}
