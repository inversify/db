import { type PrismaBatchPayload } from './PrismaBatchPayload.js';

export interface PrismaDeletionDelegate<TDeleteArgs, TDeleteManyArgs, TModel> {
  deleteMany(args?: TDeleteManyArgs): Promise<PrismaBatchPayload>;
  delete(args: TDeleteArgs): Promise<TModel>;
}
