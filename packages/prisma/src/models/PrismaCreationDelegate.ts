export interface PrismaCreationDelegate<TCreateArgs, TCreateManyArgs, TModel> {
  create(args: TCreateArgs): Promise<TModel>;
  createManyAndReturn(args: TCreateManyArgs): Promise<TModel[]>;
}
