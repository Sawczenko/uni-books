// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "books-user",
    password: "pass",
    database: "books",
  },
  dialect: "mysql",
  schema: "./src/db/schema.ts",
});
