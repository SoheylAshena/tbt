import { handleAddConfigCommand, handleStockCommand } from "./handlers/commands/admin-config";
import { handleStartCommand } from "./handlers/commands/start";
import { handleCallbackQuery } from "./handlers/callbacks";
import { handleMessage } from "./handlers/messages";
import { handlePhoto } from "./handlers/messages/photo";
import { bot } from "./infrastructure/telegram";

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
