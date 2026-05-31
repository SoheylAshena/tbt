import { type CallbackQuery } from "node-telegram-bot-api";
import { isUserJoined } from "../../utils/bot-helpers";
import { bot } from "../../config";
import { mainMenu } from "../../keyboards";

export async function joinCheckHandler(callbackQuery: CallbackQuery) {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;

  if (data === "check_join") {
    const joined = await isUserJoined(callbackQuery.from.id);

    if (joined) {
      await bot.sendMessage(msg!.chat.id, "✅ عضویت شما تایید شد.", mainMenu);
    } else {
      await bot.sendMessage(msg!.chat.id, "❌ عضویت شما تایید نشد.", mainMenu);
    }

    return;
  }
}
