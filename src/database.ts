import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: "localhost",
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

export default pool;
