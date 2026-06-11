import { adminReplyMode, bot, waitingForBalance } from "../../config";

export async function adminReplyHandler(message: string, senderID: number) {
  if (waitingForBalance.get(senderID)) {
    waitingForBalance.delete(senderID);
  }

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
