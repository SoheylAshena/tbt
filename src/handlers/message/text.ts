import { createInlineKeys, createProductKeyboard } from "../../utils/keyboard-helpers";
import { bot, testAccount } from "../../config";
import { mainMenu, productMenu } from "../../keyboards";
import { cancelOrder, displayUserInfo, payFromBalance } from "../../utils/message-helpers";
import { PAYMENT_METHODS } from "../../constants";

export async function textHandler(message: string, senderID: number) {
  switch (message) {
    case "V2ray VPN":
      const inlineKeysVPN = createProductKeyboard("vpn");
      await bot.sendMessage(senderID, "نوع اشتراک را انتخاب کنید:", inlineKeysVPN);
      break;

    case "اکانت Windscribe":
      const inlineKeysWind = createProductKeyboard("wind");
      await bot.sendMessage(senderID, "نوع اشتراک Windscribe را انتخاب کنید:", inlineKeysWind);
      break;

    case "اکانت WireGuard":
      const inlineKeysWire = createProductKeyboard("wire");
      await bot.sendMessage(senderID, "نوع اشتراک Wireguard را انتخاب کنید:", inlineKeysWire);
      break;

    case "اکانت هوش مصنوعی":
      const inlineKeysAI = createProductKeyboard("ai");
      await bot.sendMessage(senderID, "نوع اشتراک هوش مصنوعی را انتخاب کنید:", inlineKeysAI);
      break;

    case "پشتیبانی":
      await bot.sendMessage(senderID, "برای ارتباط با پشتیبانی به آیدی زیر پیام دهید:\n\n@realhamoon");
      break;

    case "محصولات":
      await bot.sendMessage(senderID, "دسته بندی محصولات:", productMenu);
      break;

    case "بازگشت به منو اصلی":
      await bot.sendMessage(senderID, "منوی اصلی:", mainMenu);
      break;

    case "حساب کاربری من":
      await displayUserInfo(senderID, senderID);
      break;

    case "دریافت اکانت تست":
      if (!testAccount) {
        await bot.sendMessage(senderID, "در حال حاضر اکانت تست در دسترس نیست.");
        break;
      }

      await bot.sendMessage(senderID, `اکانت تست شما:\n\n${testAccount}`);
      break;

    case "افزایش موجودی":
      await bot.sendMessage(senderID, `روش پرداخت خود را انتخاب نمایید:`, createInlineKeys(PAYMENT_METHODS));
      break;

    case "پرداخت از موجودی":
      await payFromBalance(senderID, senderID);
      break;

    case "لغو سفارش":
      await cancelOrder(senderID, senderID);
      break;
  }
}
