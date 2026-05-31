import { type CallbackQuery } from "node-telegram-bot-api";
import { adminIds, adminReplyMode, bot } from "../../config";

export async function adminReplyHandler(callbackQuery: CallbackQuery) {
  const data = callbackQuery.data;

  if (data!.startsWith("reply_")) {
    if (!adminIds.includes(callbackQuery.from.id)) {
      throw new Error();
    }

    const userId = Number(data!.replace("reply_", ""));

    adminReplyMode.set(callbackQuery.from.id, userId);

    await bot.sendMessage(
      callbackQuery.from.id,
      "✍️ پیام خود را برای مشتری ارسال کنید.",
    );
  }
}
