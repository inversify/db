export interface PrismaUpdateDelegate<TUpdateManyArgs, TModel> {
  updateManyAndReturn(args?: TUpdateManyArgs): Promise<TModel[]>;
}
