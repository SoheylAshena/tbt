import { adminReplyMode, bot, waitingForBalance } from "../../config";

export async function adminReplyHandler(message: string, senderID: number) {
  const targetUserId = adminReplyMode.get(senderID);
  if (!targetUserId) return;

  if (waitingForBalance.get(senderID)) {
    waitingForBalance.delete(senderID);
  }

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
