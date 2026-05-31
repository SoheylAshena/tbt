import { type Message } from "node-telegram-bot-api";
import { adminReplyHandler } from "./message/admin-reply";
import { emailHandler } from "./message/email";
import { textHandler } from "./message/text";
import { errorHandler } from "./message/error";

export async function handleMessage(msg: Message) {
  if (!msg.text || !msg.chat.id || !msg.from || msg.text.startsWith("/"))
    return;

  try {
    // const isJoined = await requireJoin(msg.chat.id, msg.from.id);
    // if (!isJoined) return;

    await adminReplyHandler(msg);
    await emailHandler(msg);
    await textHandler(msg);
  } catch (err) {
    await errorHandler(err);
  }
}
