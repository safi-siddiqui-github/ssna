import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env(isProduction ? "DATABASE_URL" : "POSTGRESQL_DATABASE_URL"),
  },
});
