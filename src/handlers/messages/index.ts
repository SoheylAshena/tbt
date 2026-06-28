import { type Message } from "node-telegram-bot-api";
import { adminBalanceSetHandler } from "../callbacks/balance-set";
import { adminReplyHandler } from "./admin-reply";
import { emailHandler } from "./email";
import { textHandler } from "./text";

export async function handleMessage(msg: Message) {
  const message = msg.text;
  const senderID = msg.from?.id;
  const chatID = msg.chat.id;

  if (!message || !chatID || !senderID || message.startsWith("/")) return;

  try {
    // // Uncomment if you want channel join to be required
    // const isJoined = await requireJoin(chatID, senderID);
    // if (!isJoined) return;

    // Administrator message handlers
    await adminReplyHandler(message, senderID);
    await adminBalanceSetHandler(message, senderID);

    await emailHandler(message, senderID);
    await textHandler(message, senderID);
  } catch (err) {
    console.error(err);
  }
}
