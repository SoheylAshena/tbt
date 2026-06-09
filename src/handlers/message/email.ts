import { bot, db, waitingForEmail } from "../../config";
import { mainMenu, pendingOrderMenu } from "../../keyboards";

export async function emailHandler(message: string, senderID: number, chatID: number) {
  const waitingOrderId = waitingForEmail.get(senderID);

  if (!waitingOrderId) return;

  if (message === "لغو سفارش") {
    waitingForEmail.delete(senderID);
    return;
  }

  const email = message!.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    waitingForEmail.delete(senderID);
    bot.sendMessage(chatID, "ایمیل وارد شده معتبر نیست", mainMenu);
    return;
  }

  await db.query(
    `
    UPDATE orders
    SET
      email = $1,
      status = 'pending_payment'
    WHERE id = $2
    `,
    [email, waitingOrderId],
  );

  waitingForEmail.delete(senderID);

  const orderResult = await db.query(
    `
  SELECT *
  FROM orders
  WHERE id = $1
  `,
    [waitingOrderId],
  );

  const order = orderResult.rows[0];

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
