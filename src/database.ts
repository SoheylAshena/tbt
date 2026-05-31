import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: "localhost",
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

export default {
  query: (text: any, params: any) => pool.query(text, params),
  pool,
};
