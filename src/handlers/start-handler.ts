import { type Message } from "node-telegram-bot-api";
import { bot } from "../config";
import { mainMenu } from "../keyboards";

export async function handleStartCommand(msg: Message) {
  if (!msg.from) return;

  try {
    await bot.setMessageReaction(msg.chat.id, msg.message_id, {
      reaction: [{ type: "emoji", emoji: "❤‍🔥" }],
    });

    await bot.sendMessage(msg.chat.id, `سلام، به سوپربات TelFactory خوش آمدید.`, mainMenu);
  } catch (err) {
    console.error(err);
  }
}
