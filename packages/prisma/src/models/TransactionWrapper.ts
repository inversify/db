import { type Wrapper } from './Wrapper.js';

export interface TransactionWrapper<T> extends Wrapper<T>, AsyncDisposable {
  rollback(): Promise<void>;
  tryCommit(): Promise<void>;
}
