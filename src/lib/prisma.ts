import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma || new PrismaClient()
} catch (error) {
  console.error('Prisma initialization failed:', error)
  // Provide a dummy object to prevent the app from crashing on evaluation
  prisma = {} as any
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
