import { type SqlDriverAdapterFactory } from '@prisma/driver-adapter-utils';
import {
  ContainerModule,
  type ContainerModuleLoadOptions,
  type MapToResolvedValueInjectOptions,
  type Newable,
} from 'inversify';

import { prismaClientServiceIdentifier } from '../models/prismaClientServiceIdentifier.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = Newable<any, any[]>;

export interface PrismaContainerModuleOptions<
  TOptions,
  TFactory extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => TOptions | Promise<TOptions>,
> {
  readonly adapter: {
    build: (options: TOptions) => SqlDriverAdapterFactory;
  };
  readonly options:
    | {
        value: TOptions;
      }
    | {
        factory: TFactory;
        params: MapToResolvedValueInjectOptions<Parameters<TFactory>>;
      };
  readonly PrismaClient: PrismaClientType;
}

function bindPrismaClientAsResolvedValue<
  TOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFactory extends (...args: any[]) => TOptions | Promise<TOptions>,
>(
  options: ContainerModuleLoadOptions,
  buildAdapter: (options: TOptions) => SqlDriverAdapterFactory,
  factory: TFactory,
  params: MapToResolvedValueInjectOptions<Parameters<TFactory>>,
  prismaClientType: PrismaClientType,
): void {
  options
    .bind(prismaClientServiceIdentifier)
    .toResolvedValue(async (...args: Parameters<TFactory>) => {
      const options: TOptions = await factory(...args);

      return new prismaClientType({
        adapter: buildAdapter(options),
      });
    }, params);
}

export class PrismaContainerModule<
  TOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFactory extends (...args: any[]) => TOptions | Promise<TOptions>,
> extends ContainerModule {
  constructor(
    prismaContainerModuleOptions: PrismaContainerModuleOptions<
      TOptions,
      TFactory
    >,
  ) {
    super((options: ContainerModuleLoadOptions) => {
      if ('value' in prismaContainerModuleOptions.options) {
        options.bind(prismaContainerModuleOptions.PrismaClient).toConstantValue(
          new prismaContainerModuleOptions.PrismaClient({
            adapter: prismaContainerModuleOptions.adapter.build(
              prismaContainerModuleOptions.options.value,
            ),
          }),
        );
      } else {
        bindPrismaClientAsResolvedValue(
          options,
          prismaContainerModuleOptions.adapter.build,
          prismaContainerModuleOptions.options.factory,
          prismaContainerModuleOptions.options.params,
          prismaContainerModuleOptions.PrismaClient,
        );
      }
    });
  }
}
