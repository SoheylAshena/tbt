import { adminIDs, adminReplyMode, bot, waitingForBalance } from "../../config";

export async function adminReplyHandler(data: string, senderID: number) {
  if (!data.startsWith("reply_") || !data.startsWith("block_") || !data.startsWith("approve_")) return;

  if (!adminIDs.includes(senderID)) return;

  const dataArr = data.split("_");
  const mode = dataArr[0];
  const recieverID = Number(dataArr[1]);

  switch (mode) {
    case "relpy":
      adminReplyMode.set(senderID, recieverID);
      await bot.sendMessage(senderID, "✍️ پیام خود را برای مشتری ارسال کنید.");
      break;
    case "approve":
      waitingForBalance.set(senderID, recieverID);
      await bot.sendMessage(senderID, "مقدار موجودی برای افزایش را وارد کنید:");
      break;
    case "block":
      break;
  }
}
