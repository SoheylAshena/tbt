import { type Message } from "node-telegram-bot-api";
import { getUserId } from "../utils/database-helpers";
import { adminIds, bot, db } from "../config";
import { mainMenu } from "../keyboards";
import { sendError } from "../utils/message-helpers";

export async function handlePhoto(msg: Message) {
  if (!msg.from || !msg.photo?.length) return;

  try {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    const userId = await getUserId(msg.from);

    const pendingOrder = await db.query(
      `
        SELECT *
        FROM orders
        WHERE user_id = $1
        AND status = 'pending_payment'
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [userId],
    );

    if (pendingOrder.rows.length === 0) {
      return await bot.sendMessage(
        chatId,
        "❌ سفارش در انتظار پرداخت پیدا نشد.",
      );
    }

    const order = pendingOrder.rows[0];

    await db.query(
      `
        UPDATE orders
        SET
          receipt_file_id = $1,
          status = 'paid',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `,
      [fileId, order.id],
    );

    const adminCaption = `
🔴 رسید جدید

📌 سفارش #${order.id}

👤 ${msg.from.first_name}
${msg.from.username ? `@${msg.from.username}` : "بدون یوزرنیم"}

📦 محصول:
${order.product_name}

${order.email ? `📧 ایمیل:\n${order.email}\n` : ""}

💰 مبلغ:
${order.amount}
`;

    for (const adminId of adminIds) {
      try {
        await bot.sendPhoto(adminId, fileId, {
          caption: adminCaption,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "💬 پاسخ به مشتری",
                  callback_data: `reply_${msg.from.id}`,
                },
              ],
            ],
          },
        });
      } catch (err) {
        console.error(err);
      }
    }

    await bot.sendMessage(
      chatId,
      `✅ رسید ثبت شد و برای ادمین ارسال گردید.
با شما تماس گرفته خواهد شد.`,
      mainMenu,
    );
  } catch (err) {
    console.error(err);

    await sendError(msg.chat.id, "خطا در ثبت رسید پرداخت.");
  }
}
