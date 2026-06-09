import { bot } from "../config";
import { deleteUserPendingOrder, getUserData } from "./database-helpers";
import { mainMenu } from "../keyboards";

export async function sendError(chatId: number, text: string) {
  try {
    await bot.sendMessage(chatId, `❌ ${text}`);
  } catch (err) {
    console.error(err);
  }
}

export async function displayUserInfo(senderID: number, chatID: number) {
  const userData = await getUserData(senderID);

  if (!userData) {
    await bot.sendMessage(chatID, "❌ اطلاعات کاربری پیدا نشد.");
    return;
  }

  const infoMessage = `
اطلاعات حساب کاربری شما:
شناسه کاربری: ${userData.telegram_id}
موجودی حساب: ${Number(userData.balance).toLocaleString("fa-IR")} تومان
        `;
  await bot.sendMessage(chatID, infoMessage);
}

export async function cancelOrder(senderID: number, chatID: number) {
  const result = await deleteUserPendingOrder(senderID);

  if (result.rows.length === 0) {
    await bot.sendMessage(chatID, "❌ سفارش فعالی پیدا نشد.", mainMenu);
    return;
  }

  await bot.sendMessage(chatID, "✅ سفارش لغو شد.", mainMenu);
}
