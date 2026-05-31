import { type OperationKind } from './OperationKind.js';
import { type Parameter } from './Parameter.js';

export type PrismaDelegate<
  TDelegate extends Record<
    OperationKind,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => Promise<unknown>
  >,
> = {
  [TKey in OperationKind]: (
    args: Parameter<TDelegate[TKey]>,
  ) => ReturnType<TDelegate[TKey]>;
};
