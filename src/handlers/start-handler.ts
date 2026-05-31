import { type Message } from "node-telegram-bot-api";
import { getUserId } from "../utils/database-helpers";
import { bot } from "../config";
import { mainMenu } from "../keyboards";
import { sendError } from "../utils/message-helpers";

export async function handleStartCommand(msg: Message) {
  if (!msg.from) return;

  try {
    await getUserId(msg.from);

    // 👍 React to the user's /start message
    await bot.setMessageReaction(msg.chat.id, msg.message_id, {
      reaction: [{ type: "emoji", emoji: "🌭" }],
    });

    await bot.sendMessage(
      msg.chat.id,
      `👋 سلام ${msg.from.first_name}!\nبه ربات فروش ویندسل خوش آمدید.`,
      mainMenu,
    );
  } catch (err) {
    console.error(err);
    await sendError(msg.chat.id, "خطایی رخ داد.");
  }
}
