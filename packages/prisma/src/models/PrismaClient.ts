export interface PrismaClient {
  $transaction: <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (client: any) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isolationLevel?: any;
    },
  ) => Promise<T>;
}
