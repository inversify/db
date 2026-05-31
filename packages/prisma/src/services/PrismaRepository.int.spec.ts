import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { faker } from '@faker-js/faker';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { execSync } from 'child_process';

import { type PrismaDelegate } from '../models/PrismaDelegate.js';
import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper.js';
import {
  type Prisma,
  PrismaClient,
  type User,
} from '../sqlite/generated/index.js';
import type * as runtime from '../sqlite/generated/runtime/client.js';
import { PrismaRepository } from './PrismaRepository.js';

class UserPrismaRepository extends PrismaRepository<
  Prisma.UserDelegate,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient.user);
  }

  protected _getDelegate(
    transactionClient: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): PrismaDelegate<Prisma.UserDelegate> {
    return transactionClient.user;
  }
}

describe(PrismaRepository, () => {
  let prismaClient: PrismaClient;
  let prismaRepository: UserPrismaRepository;

  beforeAll(() => {
    execSync(
      'pnpm exec prisma migrate deploy --config=./src/sqlite/prisma.config.ts',
      {
        stdio: 'inherit',
      },
    );

    const adapter: PrismaBetterSqlite3 = new PrismaBetterSqlite3({
      url: 'file:./src/sqlite/dev.db',
    });

    prismaClient = new PrismaClient({
      adapter,
    });

    prismaRepository = new UserPrismaRepository(prismaClient);
  });

  describe('.create', () => {
    describe('having a transaction and a user', () => {
      let firstTransactionWrapper: PrismaTransactionWrapper<
        PrismaClient,
        Omit<PrismaClient, runtime.ITXClientDenyList>
      >;
      let secondTransactionWrapper: PrismaTransactionWrapper<
        PrismaClient,
        Omit<PrismaClient, runtime.ITXClientDenyList>
      >;
      let userData: Omit<User, 'id'>;

      beforeAll(() => {
        firstTransactionWrapper = new PrismaTransactionWrapper(prismaClient);
        secondTransactionWrapper = new PrismaTransactionWrapper(prismaClient);

        userData = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        };
      });

      afterAll(async () => {
        await firstTransactionWrapper[Symbol.asyncDispose]();
        await secondTransactionWrapper[Symbol.asyncDispose]();
      });

      describe('when the user is created but the transaction is not committed and the user is searched for', () => {
        let user: User;
        let userResultPromise: Promise<User | null>;

        beforeAll(async () => {
          user = await prismaRepository.create(
            {
              data: userData,
            },
            firstTransactionWrapper,
          );

          userResultPromise = prismaRepository.findFirst(
            {
              where: {
                id: user.id,
              },
            },
            secondTransactionWrapper,
          );
        });

        describe('when the transaction is committed and the user is searched for', () => {
          let userResult: User | null;

          beforeAll(async () => {
            await firstTransactionWrapper.tryCommit();

            userResult = await userResultPromise;

            await secondTransactionWrapper.tryCommit();
          });

          it('should find the user', () => {
            expect(userResult).not.toBeNull();
            expect(userResult?.id).toBe(user.id);
          });
        });
      });
    });
  });
});
