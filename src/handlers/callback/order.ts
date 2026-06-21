import { PRODUCTS } from "../../constants";
import { createOrder, getUserExistingOrderID, updateOrder } from "../../utils/database-helpers";
import { bot, waitingForEmail } from "../../config";
import { pendingOrderMenu, waitingEmailMenu } from "../../keyboards";

export async function orderHandler(data: string, senderID: number, chatID: number) {
  const product = PRODUCTS.find((item) => item.callback_data === data);
  if (!product) return;

  let orderID = await getUserExistingOrderID(senderID);

  if (orderID) {
    await updateOrder(orderID, { product_name: product.text, amount: product.amount });
  } else {
    orderID = await createOrder(senderID, product.text, product.amount);
  }

  if (data.startsWith("ai_")) {
    waitingForEmail.set(senderID, orderID);
    await updateOrder(orderID, { status: "waiting_email" });
    return await bot.sendMessage(
      chatID,
      `📧 <b>ایمیل اکانت را وارد کنید</b>

اکانت روی این ایمیل فعال خواهد شد؛ لطفاً از درست‌بودن آن مطمئن شوید.

نمونه: <code>example@gmail.com</code>`,
      { ...waitingEmailMenu, parse_mode: "HTML" },
    );
  }

  await bot.sendMessage(
    chatID,
    `🛒 <b>سفارش شما آماده پرداخت است</b>

🧾 شماره سفارش: <code>#${orderID}</code>
📦 محصول: <b>${product.text}</b>
💰 مبلغ: <b>${product.amount.toLocaleString("fa-IR")} تومان</b>

برای نهایی‌کردن سفارش، «پرداخت از موجودی» را انتخاب کنید.
در صورت انصراف می‌توانید سفارش را لغو کنید.`,
    { ...pendingOrderMenu, parse_mode: "HTML" },
  );
}
