import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  // Using interface instead of var
  interface Global {
    prisma: PrismaClientSingleton | undefined;
  }
}

const prisma = (global as unknown as Global).prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  (global as unknown as Global).prisma = prisma;
}