import { bot } from "../../infrastructure/telegram";
import { createOrder, getUserExistingOrderID, updateOrder } from "../../repositories/orders";
import { getProduct } from "../../repositories/products";
import { pendingOrderMenu } from "../../ui/menus";

export async function orderHandler(data: string, senderID: number, chatID: number) {
  if (!data.startsWith("product_")) return;

  const productID = Number(data.slice("product_".length));
  if (!Number.isSafeInteger(productID)) return;

  const product = await getProduct(productID);
  if (!product) return;

  let orderID = await getUserExistingOrderID(senderID);

  if (orderID) {
    await updateOrder(orderID, {
      product_id: product.id,
      product_name: product.name,
      amount: product.price,
      status: "pending_payment",
    });
  } else {
    orderID = await createOrder(senderID, product);
  }

  await bot.sendMessage(
    chatID,
    `🛒 <b>سفارش شما آماده پرداخت است</b>

🧾 شماره سفارش: <code>#${orderID}</code>
📦 محصول: <b>${product.name}</b>
💰 مبلغ: <b>${product.price.toLocaleString("fa-IR")} تومان</b>

برای نهایی‌کردن سفارش، «پرداخت از موجودی» را انتخاب کنید.
در صورت انصراف می‌توانید سفارش را لغو کنید.`,
    { ...pendingOrderMenu, parse_mode: "HTML" },
  );
}
