import { PRODUCTS } from "../../constants";
import {
  createOrder,
  getUserExistingOrderID,
  updateExistingOrder,
  updateOrderStatus,
} from "../../utils/database-helpers";
import { bot, waitingForEmail } from "../../config";
import { pendingOrderMenu, waitingEmailMenu } from "../../keyboards";

export async function orderHandler(data: string, senderID: number, chatID: number) {
  const product = PRODUCTS.find((item) => item.callback_data === data);
  if (!product) return;

  let orderID = await getUserExistingOrderID(senderID);

  if (orderID) {
    await updateExistingOrder(product.text, product.amount, orderID);
  } else {
    orderID = await createOrder(senderID, product.text, product.amount);
  }

  if (data.startsWith("ai_")) {
    waitingForEmail.set(senderID, orderID);
    await updateOrderStatus(orderID, "waiting_email");
    return await bot.sendMessage(
      chatID,
      `
📧 لطفا ایمیل اکانت را ارسال کنید.

مثال:

example@gmail.com
`,
      waitingEmailMenu,
    );
  }

  await bot.sendMessage(
    chatID,
    `
🛒 سفارش جدید

📌 شماره سفارش:
#${orderID}

📦 محصول:
${product.text}

💰 مبلغ:
${product.amount.toLocaleString("fa-IR")} تومان

❌ در صورت انصراف، روی "لغو سفارش" بزنید.
`,
    pendingOrderMenu,
  );
}
