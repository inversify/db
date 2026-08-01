import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { faker } from '@faker-js/faker';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { execSync } from 'child_process';

import { PrismaClient, type User } from '../sqlite/generated/index.js';
import type * as runtime from '../sqlite/generated/runtime/client.js';
import { PrismaTransactionWrapper } from './PrismaTransactionWrapper.js';

describe(PrismaTransactionWrapper, () => {
  let prismaClient: PrismaClient;

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
          user = await (
            await firstTransactionWrapper.unwrap()
          ).user.create({
            data: userData,
          });

          userResultPromise = (async () =>
            (await secondTransactionWrapper.unwrap()).user.findFirst({
              where: {
                id: user.id,
              },
            }))();
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
