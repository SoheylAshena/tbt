import { bot } from "./config";
import { handleCallbackQuery } from "./handlers/callback-handlers";
import { handleMessage } from "./handlers/message-handlers";
import { handlePhoto } from "./handlers/photo-handler";
import { handleStartCommand } from "./handlers/start-handler";

bot.onText(/\/start/, handleStartCommand);
bot.on("message", handleMessage);
bot.on("callback_query", handleCallbackQuery);
bot.on("photo", handlePhoto);

// ====================== ERRORS ======================

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
