import { CallbackQuery } from "node-telegram-bot-api";
import { bot } from "../config";
import { joinCheckHandler } from "./callback/join-check";
import { backToMainMenuHandler } from "./callback/back-to-main";
import { adminReplyHandler } from "./callback/admin-reply";
import { orderHandler } from "./callback/order";
import { errorHandler } from "./callback/error";

export async function handleCallbackQuery(callbackQuery: CallbackQuery) {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;

  if (!msg?.from || !msg?.chat?.id || !data) return;

  try {
    await bot.answerCallbackQuery(callbackQuery.id);

    // const isJoined = await requireJoin(msg.chat.id, msg.from.id);
    // if (!isJoined) return;

    await joinCheckHandler(callbackQuery);
    await backToMainMenuHandler(callbackQuery);
    await adminReplyHandler(callbackQuery);
    await orderHandler(callbackQuery);
  } catch (err) {
    await errorHandler(err);
  }
}
