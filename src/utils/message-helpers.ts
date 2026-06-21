import { adminIDs, bot, waitingForEmail } from "../config";
import {
  deleteUserExistingOrder,
  getUserData,
  getUserPendingOrder,
  updateOrder,
  updateUserBalance,
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
  const userData = await getUserData(userID);
  const userName = userData.username;
  const balance = userData.balance;

  const pendingOrder = await getUserPendingOrder(userID);

  const orderID = pendingOrder.id;
  const productName = pendingOrder.product_name;
  const amount = pendingOrder.amount;

  try {
    if (balance < amount) {
      await bot.sendMessage(
        chatID,
        `
موجودی ناکافی، لطفا ابتدا موجودی خود را افزایش دهید

موجودی فعلی: ${balance}

هزینه سفارش: ${amount}
`,
        mainMenu,
      );
    } else {
      const newBalance = balance - amount;
      if (newBalance < 0) return;

      await updateUserBalance(userID, newBalance);
      await updateOrder(orderID, { status: "paid" });
      await sendMessageToAdmins(
        userID,
        `
یک سفارش ثبت و پرداخت شد:

محصول: ${productName}

سفارش دهنده: ${userName}
شناسه کاربری مشتری: ${userID}
`,
      );

      bot.sendMessage(
        userID,
        `
سفارش شما ثبت شد، پشتیبان به زودی با شما تماس میگیرد.
ممنون از اعتمادتون
        `,
        mainMenu,
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
