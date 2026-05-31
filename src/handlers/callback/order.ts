import { type CallbackQuery } from "node-telegram-bot-api";
import { PRODUCTS } from "../../constants";
import { getUserId } from "../../utils/database-helpers";
import { bot, db, waitingForEmail } from "../../config";
import { pendingOrderMenu } from "../../keyboards";

export async function orderHandler(callbackQuery: CallbackQuery) {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;

  const product = PRODUCTS.find((item) => item.callback_data === data);

  if (!product) {
    return;
  }

  const userId = await getUserId(callbackQuery.from);

  const existingOrder = await db.query(
    `
   SELECT id
FROM orders
WHERE user_id = $1
AND status IN (
  'pending_payment',
  'waiting_email'
)
ORDER BY updated_at DESC
LIMIT 1
  `,
    [userId],
  );

  let orderId: number;

  if (existingOrder.rows.length > 0) {
    orderId = existingOrder.rows[0].id;

    await db.query(
      `
      UPDATE orders
      SET
        product_name = $1,
        amount = $2,
        updated_at = CURRENT_TIMESTAMP,
        receipt_file_id = NULL
      WHERE id = $3
    `,
      [product.text, product.amount, orderId],
    );
  } else {
    const orderResult = await db.query(
      `
      INSERT INTO orders (
        user_id,
        product_name,
        amount,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        'pending_payment',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `,
      [userId, product.text, product.amount],
    );

    orderId = orderResult.rows[0].id;
  }

  if (data!.startsWith("ai_")) {
    waitingForEmail.set(callbackQuery.from.id, orderId);

    await db.query(
      `
  UPDATE orders
  SET status = 'waiting_email'
  WHERE id = $1
`,
      [orderId],
    );

    return await bot.sendMessage(
      msg!.chat.id,
      `
📧 لطفا ایمیل اکانت را ارسال کنید.

مثال:

example@gmail.com
`,
      pendingOrderMenu,
    );
  }

  await bot.sendMessage(
    msg!.chat.id,
    `
🛒 سفارش جدید

📌 شماره سفارش:
#${orderId}

📦 محصول:
${product.text}

💰 مبلغ:
${product.amount.toLocaleString("fa-IR")} تومان

💳 شماره کارت:

6219861078593273
به نام مهدی عنایتی

📸 پس از پرداخت، عکس رسید را ارسال کنید.

❌ در صورت انصراف، روی "لغو سفارش" بزنید.
`,
    pendingOrderMenu,
  );
}
