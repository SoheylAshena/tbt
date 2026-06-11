import { type Message } from "node-telegram-bot-api";
import { bot, waitingForRecipt } from "../config";
import { mainMenu } from "../keyboards";
import { sendError, sendPhotoToAdmins } from "../utils/message-helpers";

export async function handlePhoto(msg: Message) {
  const senderID = msg.from?.id;
  const chatID = msg.chat.id;
  const senderUsername = msg.from?.username;

  if (!senderID || !chatID || !msg.photo?.length) return;

  if (!waitingForRecipt.get(senderID)) {
    bot.sendMessage(chatID, "چرا الکی عکس میفرستی؟ بگیرم بکنمت؟");
    return;
  }

  waitingForRecipt.delete(senderID);

  try {
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    const adminCaption = `
رسید جدید جهت افزایش موجودی


${senderUsername ? `@${senderUsername}` : "بدون یوزرنیم"}
`;

    await sendPhotoToAdmins(fileId, adminCaption, senderID);

    await bot.sendMessage(
      chatID,
      `✅ رسید ثبت شد و برای ادمین ارسال گردید.
با شما تماس گرفته خواهد شد.`,
      mainMenu,
    );
  } catch (err) {
    console.error(err);
    await sendError(msg.chat.id, "خطا در ثبت رسید پرداخت.");
  }
}
