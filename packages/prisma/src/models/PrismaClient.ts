export interface PrismaClient {
  $transaction: <T>(
    // oxlint-disable-next-line typescript/no-explicit-any
    fn: (client: any) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      // oxlint-disable-next-line typescript/no-explicit-any
      isolationLevel?: any;
    },
  ) => Promise<T>;
}
