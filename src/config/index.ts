import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { Pool } from "pg";
dotenv.config();

export function getTelegramBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN is missing");
    process.exit(1);
  }
  return token;
}

export const adminIds =
  process.env.ADMIN_ID?.split(",").map((id) => Number(id.trim())) || [];

export const bot = new TelegramBot(getTelegramBotToken(), {
  polling: true,
});

const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
});

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  pool,
};

export const waitingForEmail = new Map<number, number>();
export const adminReplyMode = new Map<number, number>();
