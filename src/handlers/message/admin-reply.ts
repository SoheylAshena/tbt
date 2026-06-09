import { adminReplyMode, bot } from "../../config";

export async function adminReplyHandler(message: string, senderID: number, chatID: number) {
  const targetUserId = adminReplyMode.get(senderID);

  if (!targetUserId) return;

  await bot.sendMessage(
    targetUserId,
    `
📩 پیام پشتیبانی:

${message}
`,
  );

  await bot.sendMessage(chatID, "✅ پیام ارسال شد.");

  adminReplyMode.delete(senderID);
}
