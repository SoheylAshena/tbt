import { bot } from "../infrastructure/telegram";
import { escapeHtml } from "../shared/html";
import { mainMenu } from "../ui/menus";
import { purchasePendingOrder } from "./order-purchase";
import { sendMessageToAdmins } from "./admin-notifications";

export async function payFromBalance(userId: number, chatId: number) {
  try {
    const result = await purchasePendingOrder(userId);

    if (result.status === "no_user" || result.status === "no_order") {
      await bot.sendMessage(chatId, "❌ سفارش فعالی پیدا نشد.", mainMenu);
      return;
    }

    if (result.status === "out_of_stock") {
      await bot.sendMessage(chatId, "⏳ موجودی این محصول تمام شده است. مبلغی از حساب شما کم نشد.", mainMenu);
      return;
    }

    if (result.status === "insufficient_balance") {
      await bot.sendMessage(
        chatId,
        `موجودی ناکافی است؛ لطفاً ابتدا موجودی خود را افزایش دهید.\n\nموجودی فعلی: ${result.balance.toLocaleString("fa-IR")} تومان\nهزینه سفارش: ${result.amount.toLocaleString("fa-IR")} تومان`,
        mainMenu,
      );
      return;
    }

    await bot.sendMessage(
      chatId,
      `✅ <b>خرید شما با موفقیت انجام شد</b>\n\n🧾 شماره سفارش: <code>#${result.orderId}</code>\n📦 محصول: <b>${result.productName}</b>\n💰 موجودی باقی‌مانده: <b>${result.newBalance.toLocaleString("fa-IR")} تومان</b>\n\nبرای کپی‌کردن کانفیگ روی کادر زیر ضربه بزنید:\n\n<code>${escapeHtml(result.config)}</code>`,
      { ...mainMenu, parse_mode: "HTML" },
    );

    if (result.newlyPurchased) {
      await sendMessageToAdmins(
        userId,
        `سفارش #${result.orderId} به‌صورت خودکار تحویل شد.\n\nمحصول: ${result.productName}\nشناسه کاربر: ${userId}`,
      );
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, "خطایی رخ داد.");
  }
}
