import dotenv from "dotenv";
dotenv.config();

import TelegramBot from "node-telegram-bot-api";

// ─────────────────────────────
// 🔐 Load token safely
// ─────────────────────────────
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("❌ Missing TELEGRAM_BOT_TOKEN in .env file");
}

// ─────────────────────────────
// database
// ─────────────────────────────
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: "localhost",
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

const result = await pool.query("SELECT NOW()");
console.log(result.rows);

// ─────────────────────────────
// 🤖 Create bot (polling mode)
// ─────────────────────────────
const bot = new TelegramBot(token, {
  polling: true,
});

// ─────────────────────────────
// 📢 Startup log
// ─────────────────────────────
console.log("🤖 Telegram bot is running...");

// ─────────────────────────────
// 🟢 /start command
// ─────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "👋 Welcome!\n\nI'm your Node.js Telegram bot.\nSend me a message and I’ll reply.",
  );
});

// ─────────────────────────────
// 💬 Handle all messages
// ─────────────────────────────
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // ignore commands (already handled above)
  if (text.startsWith("/start")) return;

  bot.sendMessage(chatId, `📩 You said: ${text}/n${chatId}`);
});

// ─────────────────────────────
// ❌ Error handling (important for production)
// ─────────────────────────────
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});
