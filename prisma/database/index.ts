import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const isProduction = process.env.NODE_ENV === "production";
const localUrl = process.env.POSTGRESQL_DATABASE_URL ?? "";
const databaseUrl = process.env.DATABASE_URL ?? "";
let adapter;
if (isProduction) {
  adapter = new PrismaNeon({ connectionString: databaseUrl });
} else {
  adapter = new PrismaPg({
    connectionString: localUrl,
  });
}
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (isProduction) globalForPrisma.prisma = prisma;

export default prisma;
