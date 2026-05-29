import { beforeAll, describe, expect, it } from 'vitest';

import { InversifyPrismaError } from './InversifyPrismaError.js';
import { InversifyPrismaErrorKind } from './InversifyPrismaErrorKind.js';

describe(InversifyPrismaError, () => {
  describe('.is', () => {
    describe.each<[string, unknown, boolean]>([
      [
        'an instance of InversifyPrismaError',
        new InversifyPrismaError(InversifyPrismaErrorKind.transactionRollback),
        true,
      ],
      ['a plain object', {}, false],
      ['null', null, false],
      ['undefined', undefined, false],
      ['a string', 'error', false],
      ['a number', 42, false],
      ['a boolean', true, false],
    ])('having %s', (_: string, value: unknown, expected: boolean) => {
      let result: boolean;

      beforeAll(() => {
        result = InversifyPrismaError.is(value);
      });

      it(`should return ${String(expected)}`, () => {
        expect(result).toBe(expected);
      });
    });
  });
});
