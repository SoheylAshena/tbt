import { type Message } from "node-telegram-bot-api";
import { bot, db, waitingForEmail } from "../../config";
import { mainMenu, pendingOrderMenu } from "../../keyboards";

export async function emailHandler(msg: Message) {
  const waitingOrderId = waitingForEmail.get(msg.from!.id);

  if (!waitingOrderId) return;

  if (msg.text === "لغو سفارش") {
    waitingForEmail.delete(msg.from!.id);
    return;
  }

  const chatId = msg.chat.id;
  const email = msg.text!.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    waitingForEmail.delete(msg.from!.id);
    bot.sendMessage(chatId, "ایمیلت معتبر نیست سکسی", mainMenu);
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

  waitingForEmail.delete(msg.from!.id);

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
    chatId,
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

💳 شماره کارت:

6219861078593273
به نام مهدی عنایتی

📸 پس از پرداخت، عکس رسید را ارسال کنید.

❌ در صورت انصراف، روی "لغو سفارش" بزنید.
`,
    pendingOrderMenu,
  );

  return;
}
