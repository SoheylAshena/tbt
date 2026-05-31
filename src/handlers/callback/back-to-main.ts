import { type CallbackQuery } from "node-telegram-bot-api";
import { mainMenu } from "../../keyboards";
import { bot } from "../../config";

export async function backToMainMenuHandler(callbackQuery: CallbackQuery) {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;

  if (data === "back_to_main") {
    await bot.sendMessage(msg!.chat.id, "🏠 منوی اصلی", mainMenu);
  }
}
