import dotenv from "dotenv";

dotenv.config();

export const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
export const adminIDs = process.env.ADMIN_ID!.split(",").map((id) => Number(id.trim())) || [];
export const testAccount = process.env.TEST_ACCOUNT?.trim();
export const channelID = process.env.CHANNEL_ID!;

export const databaseConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
};
