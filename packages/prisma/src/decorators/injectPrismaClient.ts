import { inject } from 'inversify';

import { prismaClientServiceIdentifier } from '../models/prismaClientServiceIdentifier.js';

export const injectPrismaClient: MethodDecorator &
  ParameterDecorator &
  PropertyDecorator = inject(prismaClientServiceIdentifier);
