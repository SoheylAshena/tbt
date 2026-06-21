import { bot } from "./config";
import { handleCallbackQuery } from "./handlers/callback-handlers";
import { handleMessage } from "./handlers/message-handlers";
import { handlePhoto } from "./handlers/photo-handler";
import { handleStartCommand } from "./handlers/start-handler";
import { handleAddConfigCommand, handleStockCommand } from "./handlers/admin-config-handler";

bot.onText(/\/start/, handleStartCommand);
bot.onText(/^\/addconfig(?:@\w+)?(?:\s+([\s\S]+))?$/, handleAddConfigCommand);
bot.onText(/^\/stock(?:@\w+)?$/, handleStockCommand);
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
