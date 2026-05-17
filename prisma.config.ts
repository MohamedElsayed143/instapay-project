import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });


// DATABASE_URL should now be your Supabase PostgreSQL connection string, e.g.:
// postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
