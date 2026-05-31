import { bot } from "../config";

export async function sendError(chatId: number, text: string) {
  try {
    await bot.sendMessage(chatId, `❌ ${text}`);
  } catch (err) {
    console.error(err);
  }
}
