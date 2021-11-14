declare namespace Express {
  export interface Request {
    db: import('@prisma/client').PrismaClient
  }
}
