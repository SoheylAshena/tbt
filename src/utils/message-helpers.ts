import { adminIDs, bot, waitingForEmail } from "../config";
import {
  deleteUserExistingOrder,
  getUserData,
  purchasePendingOrder,
} from "./database-helpers";
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
    await bot.sendMessage(
      chatID,
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

  await bot.sendMessage(chatID, infoMessage, { parse_mode: "HTML" });
}

export async function cancelOrder(senderID: number, chatID: number) {
  if (waitingForEmail.get(senderID)) {
    waitingForEmail.delete(senderID);
  }

  const result = await deleteUserExistingOrder(senderID);

  if (result.rows.length === 0) {
    await bot.sendMessage(chatID, "❌ سفارش فعالی پیدا نشد.", mainMenu);
    return;
  }

  await bot.sendMessage(chatID, "✅ سفارش لغو شد.", mainMenu);
}

export async function sendPhotoToAdmins(fileID: string, caption: string, senderID: number) {
  for (const adminId of adminIDs) {
    try {
      await bot.sendPhoto(adminId, fileID, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "تایید",
                style: "primary",
                callback_data: `approve_${senderID}`,
              },
              {
                text: "لغو",
                style: "danger",
                callback_data: `reply_${senderID}`,
              },
              {
                text: "بلاک",
                style: "danger",
                callback_data: `block_${senderID}`,
              },
            ],
          ],
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export async function payFromBalance(userID: number, chatID: number) {
  try {
    const result = await purchasePendingOrder(userID);

    if (result.status === "no_user" || result.status === "no_order") {
      await bot.sendMessage(chatID, "❌ سفارش فعالی پیدا نشد.", mainMenu);
      return;
    }

    if (result.status === "out_of_stock") {
      await bot.sendMessage(
        chatID,
        "⏳ موجودی این محصول تمام شده است. مبلغی از حساب شما کم نشد.",
        mainMenu,
      );
      return;
    }

    if (result.status === "insufficient_balance") {
      await bot.sendMessage(
        chatID,
        `موجودی ناکافی است؛ لطفاً ابتدا موجودی خود را افزایش دهید.\n\nموجودی فعلی: ${result.balance.toLocaleString("fa-IR")} تومان\nهزینه سفارش: ${result.amount.toLocaleString("fa-IR")} تومان`,
        mainMenu,
      );
      return;
    }

    const safeConfig = result.config.replace(/[&<>]/g, (char: string) => {
      const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
      return entities[char];
    });
    await bot.sendMessage(
      chatID,
      `✅ <b>خرید شما با موفقیت انجام شد</b>\n\n🧾 شماره سفارش: <code>#${result.orderId}</code>\n📦 محصول: <b>${result.productName}</b>\n💰 موجودی باقی‌مانده: <b>${result.newBalance.toLocaleString("fa-IR")} تومان</b>\n\nبرای کپی‌کردن کانفیگ روی کادر زیر ضربه بزنید:\n\n<code>${safeConfig}</code>`,
      { ...mainMenu, parse_mode: "HTML" },
    );

    if (result.newlyPurchased) {
      await sendMessageToAdmins(
        userID,
        `سفارش #${result.orderId} به‌صورت خودکار تحویل شد.\n\nمحصول: ${result.productName}\nشناسه کاربر: ${userID}`,
      );
    }
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatID, "خطایی رخ داد.");
  }
}

export async function sendMessageToAdmins(userID: number, message: string) {
  for (const adminId of adminIDs) {
    try {
      await bot.sendMessage(adminId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "💬 پاسخ به مشتری",
                callback_data: `reply_${userID}`,
              },
            ],
          ],
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}
