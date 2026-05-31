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

import { type OperationKind } from '../models/OperationKind.js';
import { type PrismaDelegate } from '../models/PrismaDelegate.js';
import { PrismaRepository } from './PrismaRepository.js';

type TestDelegate = Record<
  OperationKind,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (args: any) => Promise<unknown>
>;

class TestPrismaRepository extends PrismaRepository<TestDelegate, unknown> {
  readonly #getDelegateMock: Mock<
    (transactionClient: unknown) => PrismaDelegate<TestDelegate>
  >;

  constructor(
    delegate: PrismaDelegate<TestDelegate>,
    getDelegateMock: Mock<
      (transactionClient: unknown) => PrismaDelegate<TestDelegate>
    >,
  ) {
    super(delegate);

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
  ): PrismaDelegate<TestDelegate> {
    return this.#getDelegateMock(transactionClient);
  }
}

async function callPrismaRepositoryOperation(
  prismaRepository: TestPrismaRepository,
  operationKind: OperationKind,
  args: unknown,
  transaction?: unknown,
): Promise<unknown> {
  switch (operationKind) {
    case 'create':
      return prismaRepository.create(args, transaction);
    case 'createManyAndReturn':
      return prismaRepository.createManyAndReturn(args, transaction);
    case 'delete':
      return prismaRepository.delete(args, transaction);
    case 'deleteMany':
      return prismaRepository.deleteMany(args, transaction);
    case 'findFirst':
      return prismaRepository.findFirst(args, transaction);
    case 'findMany':
      return prismaRepository.findMany(args, transaction);
    case 'update':
      return prismaRepository.update(args, transaction);
    case 'updateManyAndReturn':
      return prismaRepository.updateManyAndReturn(args, transaction);
  }
}

describe(PrismaRepository, () => {
  let delegateMock: Mocked<PrismaDelegate<TestDelegate>>;
  let getDelegateMock: Mock<
    (transactionClient: unknown) => PrismaDelegate<TestDelegate>
  >;

  let createPrismaService: TestPrismaRepository;

  beforeAll(() => {
    delegateMock = {
      create: vitest.fn(),
      createManyAndReturn: vitest.fn(),
      delete: vitest.fn(),
      deleteMany: vitest.fn(),
      findFirst: vitest.fn(),
      findMany: vitest.fn(),
      update: vitest.fn(),
      updateManyAndReturn: vitest.fn(),
    };

    getDelegateMock = vitest.fn().mockReturnValue(delegateMock);

    createPrismaService = new TestPrismaRepository(
      delegateMock,
      getDelegateMock,
    );
  });

  describe.each<OperationKind>([
    'create',
    'createManyAndReturn',
    'delete',
    'deleteMany',
    'findFirst',
    'findMany',
    'update',
    'updateManyAndReturn',
  ])(`.%s`, (operationKind: OperationKind) => {
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

          delegateMock[operationKind].mockResolvedValueOnce(
            delegateResultFixture,
          );

          result = await callPrismaRepositoryOperation(
            createPrismaService,
            operationKind,
            prismaCreateArgsFixture,
          );
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call the getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call the delegate.create()', () => {
          expect(delegateMock[operationKind]).toHaveBeenCalledExactlyOnceWith(
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

          delegateMock[operationKind].mockResolvedValueOnce(
            delegateResultFixture,
          );

          result = await callPrismaRepositoryOperation(
            createPrismaService,
            operationKind,
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

        it(`should call transaction.${operationKind}()`, () => {
          expect(delegateMock[operationKind]).toHaveBeenCalledExactlyOnceWith(
            prismaCreateArgsFixture,
          );
        });

        it('should return the expected result', () => {
          expect(result).toBe(delegateResultFixture);
        });
      });
    });
  });
});
