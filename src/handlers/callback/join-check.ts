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
      await bot.sendMessage(
        msg!.chat.id,
        "✅ <b>عضویت شما تأیید شد!</b>\n\nخوش آمدید؛ حالا می‌توانید از همه امکانات ربات استفاده کنید 👇",
        { ...mainMenu, parse_mode: "HTML" },
      );
    } else {
      await bot.sendMessage(
        msg!.chat.id,
        "❌ <b>هنوز عضو کانال نیستید</b>\n\nابتدا در کانال عضو شوید، سپس دوباره روی «بررسی عضویت» بزنید.",
        { ...mainMenu, parse_mode: "HTML" },
      );
    }

    return;
  }
}
