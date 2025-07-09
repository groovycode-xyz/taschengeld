import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'event' },
            { level: 'warn', emit: 'event' },
          ]
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Log Prisma events in development
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore - Prisma $on event handler exists but types are not updated
  prisma.$on('query', (e: any) => {
    logger.debug('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: e.duration,
    });
  });

  // @ts-ignore - Prisma $on event handler exists but types are not updated
  prisma.$on('error', (e: any) => {
    logger.error('Prisma Error', e);
  });

  // @ts-ignore - Prisma $on event handler exists but types are not updated
  prisma.$on('warn', (e: any) => {
    logger.warn('Prisma Warning', e);
  });
}
