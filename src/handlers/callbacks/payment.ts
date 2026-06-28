import { bot } from "../../infrastructure/telegram";
import { waitingForReceipt } from "../../shared/state";

export async function paymentMethodHandler(data: string, chatID: number, userID: number) {
  if (!data.startsWith("pay")) return;

  waitingForReceipt.set(userID, true);

  switch (data) {
    case "pay_card":
      await bot.sendMessage(
        chatID,
        `💳 <b>پرداخت کارت‌به‌کارت</b>

مبلغ موردنظر را به کارت زیر واریز کنید:

<code>6219861920557898</code>
به نام <b>نظری</b>

📸 پس از واریز، تصویر واضح رسید را همین‌جا ارسال کنید.`,
        { parse_mode: "HTML" },
      );
      break;
    case "pay_trx":
      await bot.sendMessage(
        chatID,
        `🪙 <b>پرداخت با ترون (TRX)</b>

مبلغ را از طریق شبکه <b>BEP-20</b> به آدرس زیر ارسال کنید:

<code>TU7F5Ubk2qSvwmX8t3dhFyrVUPPF9yxNoS</code>

⚠️ لطفاً پیش از انتقال، شبکه و آدرس کیف پول را با دقت بررسی کنید.

📸 پس از پرداخت، تصویر رسید تراکنش را همین‌جا ارسال کنید.`,
        { parse_mode: "HTML" },
      );
      break;
  }
}
