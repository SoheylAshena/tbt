import { type Message } from "node-telegram-bot-api";
import { bot } from "../../infrastructure/telegram";
import { sendPhotoToAdmins } from "../../services/admin-notifications";
import { sendError } from "../../services/user-actions";
import { waitingForReceipt } from "../../shared/state";
import { mainMenu } from "../../ui/menus";

export async function handlePhoto(msg: Message) {
  const senderID = msg.from?.id;
  const chatID = msg.chat.id;
  const senderUsername = msg.from?.username;

  if (!senderID || !chatID || !msg.photo?.length) return;

  if (!waitingForReceipt.get(senderID)) {
    bot.sendMessage(chatID, "عکس نامعتبر❗");
    return;
  }

  waitingForReceipt.delete(senderID);

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
