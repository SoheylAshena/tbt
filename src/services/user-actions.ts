import { bot } from "../infrastructure/telegram";
import { deleteUserExistingOrder } from "../repositories/orders";
import { getUserData } from "../repositories/users";
import { waitingForEmail } from "../shared/state";
import { mainMenu } from "../ui/menus";

export async function sendError(chatId: number, text: string) {
  try {
    await bot.sendMessage(chatId, `❌ ${text}`);
  } catch (error) {
    console.error(error);
  }
}

export async function displayUserInfo(senderId: number, chatId: number) {
  const userData = await getUserData(senderId);

  if (!userData) {
    await bot.sendMessage(
      chatId,
      "❌ <b>حساب کاربری پیدا نشد</b>\n\nلطفاً دوباره ربات را با دستور /start راه‌اندازی کنید.",
      { parse_mode: "HTML" },
    );
    return;
  }

  const formattedBalance = Number(userData.balance).toLocaleString("fa-IR");
  const infoMessage = `👤 <b>حساب کاربری شما</b>

━━━━━━━━━━━━━━
🆔 <b>شناسه کاربری</b>
<code>${userData.telegram_id}</code>

💰 <b>موجودی حساب</b>
<b>${formattedBalance} تومان</b>
━━━━━━━━━━━━━━

✨ از همراهی شما با TelFactory خوشحالیم.`;

  await bot.sendMessage(chatId, infoMessage, { parse_mode: "HTML" });
}

export async function cancelOrder(senderId: number, chatId: number) {
  waitingForEmail.delete(senderId);

  const result = await deleteUserExistingOrder(senderId);
  const message = result.rows.length === 0 ? "❌ سفارش فعالی پیدا نشد." : "✅ سفارش لغو شد.";

  await bot.sendMessage(chatId, message, mainMenu);
}
