import { type TypeMapModel } from './TypeMapModel.js';
import { type TypeMapOperationKind } from './TypeMapOperationKind.js';

export type PrismaDelegate<TTypeMapModel extends TypeMapModel> = {
  [TKey in TypeMapOperationKind]: (
    args: TTypeMapModel['operations'][TKey]['args'],
  ) => Promise<TTypeMapModel['operations'][TKey]['result']>;
};
