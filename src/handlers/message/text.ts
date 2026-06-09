import { createProductKeyboard } from "../../utils/keyboard-helpers";
import { bot } from "../../config";
import { mainMenu, productMenu } from "../../keyboards";
import { cancelOrder, displayUserInfo } from "../../utils/message-helpers";

export async function textHandler(message: string, senderID: number, chatID: number) {
  switch (message) {
    case "VPN":
      const inlineKeysVPN = createProductKeyboard("vpn");
      await bot.sendMessage(chatID, "نوع اشتراک VPN را انتخاب کنید:", inlineKeysVPN);
      break;

    case "اکانت Windscribe":
      const inlineKeysWind = createProductKeyboard("wind");
      await bot.sendMessage(chatID, "نوع اشتراک Windscribe را انتخاب کنید:", inlineKeysWind);
      break;

    case "اکانت WireGuard":
      const inlineKeysWire = createProductKeyboard("wire");
      await bot.sendMessage(chatID, "نوع اشتراک Wireguard را انتخاب کنید:", inlineKeysWire);
      break;

    case "اکانت هوش مصنوعی":
      const inlineKeysAI = createProductKeyboard("ai");
      await bot.sendMessage(chatID, "نوع اشتراک هوش مصنوعی را انتخاب کنید:", inlineKeysAI);
      break;

    case "محصولات":
      await bot.sendMessage(chatID, "دسته بندی محصولات:", productMenu);
      break;

    case "بازگشت به منو اصلی":
      await bot.sendMessage(chatID, "منوی اصلی:", mainMenu);
      break;

    case "حساب کاربری من":
      await displayUserInfo(chatID, senderID);
      break;

    case "افزایش موجودی":
      break;

    case "پرداخت از موجودی":
      break;

    case "لغو سفارش":
      await cancelOrder(senderID, chatID);
      break;
  }
}
