export interface PrismaFindDelegate<TFindArgs, TFindManyArgs, TModel> {
  findFirst(args: TFindArgs): Promise<TModel | null>;
  findMany(args?: TFindManyArgs): Promise<TModel[]>;
}
