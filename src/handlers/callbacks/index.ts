import { CallbackQuery } from "node-telegram-bot-api";
import { bot } from "../../infrastructure/telegram";
import { adminReplyHandler } from "./admin-reply";
import { backToMainMenuHandler } from "./back-to-main";
import { orderHandler } from "./order";
import { paymentMethodHandler } from "./payment";

export async function handleCallbackQuery(callbackQuery: CallbackQuery) {
  const data = callbackQuery.data;
  const senderID = callbackQuery.from.id;
  const chatID = callbackQuery.message?.chat.id;
  const ID = callbackQuery.id;

  if (!senderID || !chatID || !data) return;

  try {
    await bot.answerCallbackQuery(ID);

    // const isJoined = await requireJoin(message.chat.id, message.from.id);
    // if (!isJoined) return;

    // await joinCheckHandler(callbackQuery);
    await backToMainMenuHandler(data, chatID);
    await adminReplyHandler(data, senderID);
    await orderHandler(data, senderID, chatID);
    await paymentMethodHandler(data, chatID, senderID);
  } catch (err) {
    console.error(err);
  }
}
