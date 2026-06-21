import { type Message } from "node-telegram-bot-api";
import { bot } from "../config";
import { mainMenu } from "../keyboards";
import { createUser } from "../utils/database-helpers";

export async function handleStartCommand(msg: Message) {
  if (!msg.from) return;

  try {
    await createUser(msg.from);

    await bot.setMessageReaction(msg.chat.id, msg.message_id, {
      reaction: [{ type: "emoji", emoji: "❤‍🔥" }],
    });

    const firstName = msg.from.first_name;
    const welcomeMessage = `سلام <b>${firstName}</b> عزیز 👋

به <b>TelFactory</b> خوش اومدی! ✨
اینجا می‌تونی سریع و راحت سرویس موردنظرت رو تهیه و حسابت رو مدیریت کنی.

از منوی زیر شروع کن 👇`;

    await bot.sendMessage(msg.chat.id, welcomeMessage, {
      ...mainMenu,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error(err);
  }
}
