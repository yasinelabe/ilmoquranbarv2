import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../prisma/generated/client'

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  password:'cIIse34#$',
  user:'root',
  database:'ilmoquranbar'
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };


export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
