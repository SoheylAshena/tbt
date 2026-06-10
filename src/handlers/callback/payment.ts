import { bot } from "../../config";

export async function paymentMethodHandler(data: string, chatID: number) {
  if (!data.startsWith("pay")) return;
  switch (data) {
    case "pay_card":
      await bot.sendMessage(chatID, "شماره کارت");
      break;
    case "pay_trx":
      await bot.sendMessage(chatID, "آدرس ولت ترون");
      break;
  }
}
