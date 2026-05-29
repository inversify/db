import { type InversifyPrismaErrorKind } from './InversifyPrismaErrorKind.js';

const isErrorSymbol: unique symbol = Symbol.for(
  '@inversifyjs/prisma/InversifyPrismaError',
);

export class InversifyPrismaError extends Error {
  public [isErrorSymbol]: true;

  public kind: InversifyPrismaErrorKind;

  constructor(
    kind: InversifyPrismaErrorKind,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this[isErrorSymbol] = true;
    this.kind = kind;
  }

  public static is(value: unknown): value is InversifyPrismaError {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as Record<string | symbol, unknown>)[isErrorSymbol] === true
    );
  }

  public static isErrorOfKind(
    value: unknown,
    kind: InversifyPrismaErrorKind,
  ): value is InversifyPrismaError {
    return InversifyPrismaError.is(value) && value.kind === kind;
  }
}
