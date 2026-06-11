import { type Message } from "node-telegram-bot-api";
import { adminReplyHandler } from "./message/admin-reply";
import { emailHandler } from "./message/email";
import { textHandler } from "./message/text";
import { adminBalanceSetHandler } from "./callback/balance-set";

export async function handleMessage(msg: Message) {
  const message = msg.text;
  const senderID = msg.from?.id;
  const chatID = msg.chat.id;

  if (!message || !chatID || !senderID || message.startsWith("/")) return;

  try {
    // const isJoined = await requireJoin(chatID, senderID);
    // if (!isJoined) return;

    await adminBalanceSetHandler(message, senderID, chatID);
    await adminReplyHandler(message, senderID, chatID);
    await emailHandler(message, senderID, chatID);
    await textHandler(message, senderID, chatID);
  } catch (err) {
    console.error(err);
  }
}
