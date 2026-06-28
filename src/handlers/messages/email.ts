import { bot } from "../../infrastructure/telegram";
import { getOrderData, updateOrder } from "../../repositories/orders";
import { waitingForEmail } from "../../shared/state";
import { mainMenu, pendingOrderMenu } from "../../ui/menus";

export async function emailHandler(message: string, senderID: number) {
  const waitingOrderId = waitingForEmail.get(senderID);
  if (!waitingOrderId) return;

  waitingForEmail.delete(senderID);

  const email = message.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    bot.sendMessage(senderID, "ایمیل وارد شده معتبر نیست", mainMenu);
    return;
  }

  await updateOrder(waitingOrderId, { email, status: "pending_payment" });

  const order = await getOrderData(waitingOrderId);

  await bot.sendMessage(
    senderID,
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
