import TelegramBot from "node-telegram-bot-api";
import "./config/env.js";
import db from "./database.js";
import { mainMenu, vpnTypes } from "./keyboards.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

console.log("Bot is running...");

// ==================== START ====================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id!;
  const user = msg.from!;

  await db.query(
    `
        INSERT INTO users (telegram_id, username, first_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (telegram_id) 
        DO UPDATE SET username = $2, first_name = $3, updated_at = CURRENT_TIMESTAMP
    `,
    [user.id, user.username, user.first_name],
  );

  bot.sendMessage(
    chatId,
    `👋 سلام ${user.first_name}!\nبه ربات فروش خوش آمدید.`,
    mainMenu,
  );
});

// ==================== MESSAGE HANDLER ====================
bot.on("message", async (msg) => {
  if (msg.photo) return; // بعداً هندل می‌کنیم

  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "🛒 خرید VPN") {
    bot.sendMessage(chatId, "نوع اشتراک VPN را انتخاب کنید:", vpnTypes);
  } else if (text === "🛒 خرید اکانت Windscribe") {
    bot.sendMessage(chatId, "در حال توسعه...");
  } else if (text === "🛒 خرید اکانت هوش مصنوعی") {
    bot.sendMessage(chatId, "در حال توسعه...");
  } else if (text === "📋 سفارش‌های من") {
    // بعداً پیاده‌سازی می‌کنیم
    bot.sendMessage(chatId, "سفارش‌های شما در حال حاضر خالی است.");
  }
});

// ==================== CALLBACK QUERY (دکمه‌های اینلاین) ====================
bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message!;
  const data = callbackQuery.data!;
  const userId = callbackQuery.from.id!;

  await bot.answerCallbackQuery(callbackQuery.id);

  if (data.startsWith("vpn_")) {
    const [_, period, priceStr] = data.split("_");
    const price = parseInt(priceStr);

    // گرفتن id کاربر از دیتابیس
    const userRes: any = await db.query(
      "SELECT id FROM users WHERE telegram_id = $1",
      [userId],
    );
    const userDbId = userRes.rows[0].id;

    // ایجاد سفارش
    const orderRes: any = await db.query(
      `
            INSERT INTO orders (user_id, product_id, amount, status)
            VALUES ($1, 
                (SELECT id FROM products WHERE category = 'vpn' AND name LIKE $2 LIMIT 1),
                $3, 'pending_payment')
            RETURNING id
        `,
      [userDbId, `%${period}%`, price],
    );

    const orderId = orderRes.rows[0].id;

    const text = `
🛒 <b>سفارش جدید ثبت شد</b>
━━━━━━━━━━━━━━
📌 شماره سفارش: <code>#${orderId}</code>
📦 محصول: VPN ${period}
💰 مبلغ: ${price.toLocaleString("fa-IR")} تومان

💳 لطفاً مبلغ را به شماره کارت زیر واریز کنید:

<code>1234 5678 9012 3456</code>
به نام: [نام صاحب کارت]

📸 بعد از واریز، عکس رسید را ارسال کنید.
        `;

    await bot.sendMessage(msg.chat.id, text, { parse_mode: "HTML" });
  }
});

// ==================== دریافت عکس رسید ====================
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo![msg.photo!.length - 1]; // باکیفیت‌ترین عکس
  const fileId = photo.file_id;

  // پیدا کردن آخرین سفارش در حال انتظار کاربر
  const userRes: any = await db.query(
    "SELECT id FROM users WHERE telegram_id = $1",
    [msg.from!.id],
  );
  const userDbId = userRes.rows[0].id;

  const orderRes: any = await db.query(
    `
        SELECT id FROM orders 
        WHERE user_id = $1 AND status = 'pending_payment'
        ORDER BY created_at DESC LIMIT 1
    `,
    [userDbId],
  );

  if (orderRes.rows.length === 0) {
    return bot.sendMessage(chatId, "هیچ سفارش فعالی برای ارسال رسید ندارید.");
  }

  const orderId = orderRes.rows[0].id;

  // آپدیت سفارش با رسید
  await db.query(
    `
        UPDATE orders 
        SET receipt_file_id = $1, status = 'paid', updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
    `,
    [fileId, orderId],
  );

  // ارسال رسید به ادمین
  const adminText = `
🔴 رسید جدید رسید!

📌 شماره سفارش: #${orderId}
👤 کاربر: ${msg.from!.first_name} (@${msg.from!.username || "بدون یوزرنیم"})
    `;

  await bot.sendPhoto(901634254, fileId, {
    caption: adminText,
    parse_mode: "HTML",
  });
  await bot.sendMessage(
    chatId,
    "✅ رسید شما دریافت شد.\nپس از بررسی توسط ادمین، اطلاعات حساب برایتان ارسال خواهد شد.",
  );
});

module.exports = bot;
