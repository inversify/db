import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  type Mock,
  type Mocked,
  vitest,
} from 'vitest';

import { type PrismaCreationDelegate } from '../models/PrismaCreationDelegate.js';
import { CreatePrismaService } from './CreatePrismaService.js';

class TestCreatePrismaService extends CreatePrismaService<
  unknown,
  unknown,
  unknown,
  unknown
> {
  readonly #getDelegateMock: Mock<
    (
      transactionClient: unknown,
    ) => PrismaCreationDelegate<unknown, unknown, unknown>
  >;

  constructor(
    delegate: PrismaCreationDelegate<unknown, unknown, unknown>,
    getDelegateMock: Mock<
      (
        transactionClient: unknown,
      ) => PrismaCreationDelegate<unknown, unknown, unknown>
    >,
  ) {
    super(delegate);

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
  ): PrismaCreationDelegate<unknown, unknown, unknown> {
    return this.#getDelegateMock(transactionClient);
  }
}

describe(CreatePrismaService, () => {
  let delegateMock: Mocked<PrismaCreationDelegate<unknown, unknown, unknown>>;
  let getDelegateMock: Mock<
    (
      transactionClient: unknown,
    ) => PrismaCreationDelegate<unknown, unknown, unknown>
  >;

  let createPrismaService: TestCreatePrismaService;

  beforeAll(() => {
    delegateMock = {
      create: vitest.fn(),
      createManyAndReturn: vitest.fn(),
    };

    getDelegateMock = vitest.fn().mockReturnValue(delegateMock);

    createPrismaService = new TestCreatePrismaService(
      delegateMock,
      getDelegateMock,
    );
  });

  describe('.create', () => {
    describe('having no transaction', () => {
      let prismaCreateArgsFixture: unknown;

      beforeAll(() => {
        prismaCreateArgsFixture = Symbol();
      });

      describe('when called', () => {
        let delegateResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          delegateResultFixture = Symbol();

          delegateMock.create.mockResolvedValueOnce(delegateResultFixture);

          result = await createPrismaService.create(prismaCreateArgsFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call the getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call the delegate.create()', () => {
          expect(delegateMock.create).toHaveBeenCalledExactlyOnceWith(
            prismaCreateArgsFixture,
          );
        });

        it('should return the expected result', () => {
          expect(result).toBe(delegateResultFixture);
        });
      });
    });

    describe('having a transaction', () => {
      let prismaCreateArgsFixture: unknown;
      let transactionFixture: unknown;

      beforeAll(() => {
        prismaCreateArgsFixture = Symbol();
        transactionFixture = Symbol();
      });

      describe('when called', () => {
        let delegateResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          delegateResultFixture = Symbol();

          delegateMock.create.mockResolvedValueOnce(delegateResultFixture);

          result = await createPrismaService.create(
            prismaCreateArgsFixture,
            transactionFixture,
          );
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call the getDelegate()', () => {
          expect(getDelegateMock).toHaveBeenCalledExactlyOnceWith(
            transactionFixture,
          );
        });

        it('should call the transaction.create()', () => {
          expect(delegateMock.create).toHaveBeenCalledExactlyOnceWith(
            prismaCreateArgsFixture,
          );
        });

        it('should return the expected result', () => {
          expect(result).toBe(delegateResultFixture);
        });
      });
    });
  });

  describe('.createMany', () => {
    describe('having no transaction', () => {
      let prismaCreateArgsFixture: unknown;

      beforeAll(() => {
        prismaCreateArgsFixture = Symbol();
      });

      describe('when called', () => {
        let delegateResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          delegateResultFixture = Symbol();

          delegateMock.createManyAndReturn.mockResolvedValueOnce([
            delegateResultFixture,
          ]);

          result = await createPrismaService.createMany(
            prismaCreateArgsFixture,
          );
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call the getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call the delegate.createManyAndReturn()', () => {
          expect(
            delegateMock.createManyAndReturn,
          ).toHaveBeenCalledExactlyOnceWith(prismaCreateArgsFixture);
        });

        it('should return the expected result', () => {
          expect(result).toStrictEqual([delegateResultFixture]);
        });
      });
    });

    describe('having a transaction', () => {
      let prismaCreateArgsFixture: unknown;
      let transactionFixture: unknown;

      beforeAll(() => {
        prismaCreateArgsFixture = Symbol();
        transactionFixture = Symbol();
      });

      describe('when called', () => {
        let delegateResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          delegateResultFixture = Symbol();

          delegateMock.createManyAndReturn.mockResolvedValueOnce([
            delegateResultFixture,
          ]);

          result = await createPrismaService.createMany(
            prismaCreateArgsFixture,
            transactionFixture,
          );
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call the getDelegate()', () => {
          expect(getDelegateMock).toHaveBeenCalledExactlyOnceWith(
            transactionFixture,
          );
        });

        it('should call the transaction.createManyAndReturn()', () => {
          expect(
            delegateMock.createManyAndReturn,
          ).toHaveBeenCalledExactlyOnceWith(prismaCreateArgsFixture);
        });

        it('should return the expected result', () => {
          expect(result).toStrictEqual([delegateResultFixture]);
        });
      });
    });
  });
});
