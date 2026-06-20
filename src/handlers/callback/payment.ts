import { bot, waitingForRecipt } from "../../config";

export async function paymentMethodHandler(data: string, chatID: number, userID: number) {
  if (!data.startsWith("pay")) return;

  waitingForRecipt.set(userID, true);

  switch (data) {
    case "pay_card":
      await bot.sendMessage(
        chatID,
        `
شماره کارت جهت واریز:
6219861920557898
نظری

لطفا رسید واریز خود را همینجا به صورت عکس ارسال کنید.
`,
      );
      break;
    case "pay_trx":
      await bot.sendMessage(
        chatID,
        `
آدرس ولت ترون (TRC-20):
TU7F5Ubk2qSvwmX8t3dhFyrVUPPF9yxNoS

لطفا عکس رسید تراکنش را ارسال کنید.
`,
      );
      break;
  }
}
