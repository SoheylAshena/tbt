import { bot } from "../../infrastructure/telegram";
import { adminReplyMode } from "../../shared/state";

export async function adminReplyHandler(message: string, senderID: number) {
  const targetUserId = adminReplyMode.get(senderID);
  if (!targetUserId) return;

  await bot.sendMessage(
    targetUserId,
    `
📩 پیام پشتیبانی:

${message}
`,
  );

  await bot.sendMessage(senderID, "✅ پیام ارسال شد.");

  adminReplyMode.delete(senderID);
}
