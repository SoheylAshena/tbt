import { Pool } from "pg";
import { databaseConfig } from "../config";

const pool = new Pool(databaseConfig);

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  pool,
};
