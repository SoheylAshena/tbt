import { bot, db, waitingForEmail } from "../../config";
import { mainMenu, pendingOrderMenu } from "../../keyboards";
import { getOrderData, updateOrderEmail, updateOrderStatus } from "../../utils/database-helpers";

export async function emailHandler(message: string, senderID: number, chatID: number) {
  const waitingOrderId = waitingForEmail.get(senderID);
  if (!waitingOrderId) return;

  waitingForEmail.delete(senderID);

  const email = message.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    bot.sendMessage(chatID, "ایمیل وارد شده معتبر نیست", mainMenu);
    return;
  }

  await updateOrderEmail(waitingOrderId, email);
  await updateOrderStatus(waitingOrderId, "pending_payment");

  const order = await getOrderData(waitingOrderId);

  await bot.sendMessage(
    chatID,
    `
🛒 سفارش جدید

📌 شماره سفارش:
#${order.id}

📦 محصول:
${order.product_name}

📧 ایمیل:
${order.email}

💰 مبلغ:
${Number(order.amount).toLocaleString("fa-IR")} تومان

❌ در صورت انصراف، روی "لغو سفارش" بزنید.
`,
    pendingOrderMenu,
  );

  return;
}
