import { type TypeMapModelOperation } from './TypeMapModelOperation.js';
import { type TypeMapOperationKind } from './TypeMapOperationKind.js';

export interface TypeMapModel {
  operations: {
    [TKey in TypeMapOperationKind]: TypeMapModelOperation;
  };
}
