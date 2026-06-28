import { adminIDs } from "../config";
import { bot } from "../infrastructure/telegram";

export async function sendPhotoToAdmins(fileId: string, caption: string, senderId: number) {
  for (const adminId of adminIDs) {
    try {
      await bot.sendPhoto(adminId, fileId, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "تایید",
                style: "primary",
                callback_data: `approve_${senderId}`,
              },
              {
                text: "لغو",
                style: "danger",
                callback_data: `reply_${senderId}`,
              },
              {
                text: "بلاک",
                style: "danger",
                callback_data: `block_${senderId}`,
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export async function sendMessageToAdmins(userId: number, message: string) {
  for (const adminId of adminIDs) {
    try {
      await bot.sendMessage(adminId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "💬 پاسخ به مشتری",
                callback_data: `reply_${userId}`,
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
