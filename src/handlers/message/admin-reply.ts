import { Message } from "node-telegram-bot-api";
import { adminReplyMode, bot } from "../../config";

export async function adminReplyHandler(msg: Message) {
  const targetUserId = adminReplyMode.get(msg.from!.id);

  if (!targetUserId) return;

  await bot.sendMessage(
    targetUserId,
    `
📩 پیام پشتیبانی:

${msg.text}
`,
  );

  await bot.sendMessage(msg.chat.id, "✅ پیام ارسال شد.");

  adminReplyMode.delete(msg.from!.id);
}
