import { type Message } from "node-telegram-bot-api";
import { createProductKeyboard } from "../../utils/keyboard-helpers";
import { bot } from "../../config";
import { mainMenu, productMenu } from "../../keyboards";
import {
  deleteUserPendingOrder,
  getUserData,
  getUserId,
} from "../../utils/database-helpers";

export async function textHandler(msg: Message) {
  if (!msg.text || !msg.from) return;

  const chatId = msg.chat.id;

  switch (msg.text) {
    case "VPN":
      const inlineKeysVPN = createProductKeyboard("vpn");
      await bot.sendMessage(
        chatId,
        "نوع اشتراک VPN را انتخاب کنید:",
        inlineKeysVPN,
      );
      break;

    case "اکانت Windscribe":
      const inlineKeysWind = createProductKeyboard("wind");
      await bot.sendMessage(
        chatId,
        "نوع اشتراک Windscribe را انتخاب کنید:",
        inlineKeysWind,
      );
      break;

    case "اکانت WireGuard":
      const inlineKeysWire = createProductKeyboard("wire");
      await bot.sendMessage(
        chatId,
        "نوع اشتراک Wireguard را انتخاب کنید:",
        inlineKeysWire,
      );
      break;

    case "اکانت هوش مصنوعی":
      const inlineKeysAI = createProductKeyboard("ai");
      await bot.sendMessage(
        chatId,
        "نوع اشتراک هوش مصنوعی را انتخاب کنید:",
        inlineKeysAI,
      );
      break;

    case "محصولات":
      await bot.sendMessage(chatId, "دسته بندی محصولات:", productMenu);
      break;

    case "بازگشت به منو اصلی":
      await bot.sendMessage(chatId, "منوی اصلی:", mainMenu);
      break;

    case "حساب کاربری من":
      const userData = await getUserData(msg.from.id);

      async function displayUserInfo(userData: any) {
        if (!userData) {
          await bot.sendMessage(chatId, "❌ اطلاعات کاربری پیدا نشد.");
          return;
        }

        const infoMessage = `
اطلاعات حساب کاربری شما:
کدیکتا: ${userData.telegram_id}
موجودی حساب: ${Number(userData.balance).toLocaleString("fa-IR")} تومان
        `;
        await bot.sendMessage(chatId, infoMessage);
      }

      await displayUserInfo(userData);
      break;

    case "لغو سفارش": {
      const userId = await getUserId(msg.from);
      const result = await deleteUserPendingOrder(userId);

      if (result.rows.length === 0) {
        await bot.sendMessage(chatId, "❌ سفارش فعالی پیدا نشد.", mainMenu);
        break;
      }

      await bot.sendMessage(chatId, "✅ سفارش لغو شد.", mainMenu);
      break;
    }
  }
}
