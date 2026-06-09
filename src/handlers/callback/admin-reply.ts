import { adminIDs, adminReplyMode, bot } from "../../config";

export async function adminReplyHandler(data: string, senderID: number) {
  if (data!.startsWith("reply_")) return;
  if (!adminIDs.includes(senderID)) return;

  const recieverID = Number(data!.replace("reply_", ""));

  adminReplyMode.set(senderID, recieverID);

  await bot.sendMessage(senderID, "✍️ پیام خود را برای مشتری ارسال کنید.");
}
