import { createInlineKeys, createProductKeyboard } from "../../utils/keyboard-helpers";
import { bot, testAccount } from "../../config";
import { mainMenu, productMenu } from "../../keyboards";
import { cancelOrder, displayUserInfo, payFromBalance } from "../../utils/message-helpers";
import { PAYMENT_METHODS } from "../../constants";

function escapeHtml(value: string) {
  return value.replace(/[&<>]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return entities[character];
  });
}

export async function textHandler(message: string, senderID: number) {
  switch (message) {
    case "V2ray VPN":
      const inlineKeysVPN = createProductKeyboard("vpn");
      await bot.sendMessage(
        senderID,
        "🌐 <b>انتخاب اشتراک V2Ray</b>\n\nحجم و مدت اشتراک موردنظرتان را انتخاب کنید 👇",
        { ...inlineKeysVPN, parse_mode: "HTML" },
      );
      break;

    case "اکانت Windscribe":
      const inlineKeysWind = createProductKeyboard("wind");
      await bot.sendMessage(
        senderID,
        "🛡 <b>انتخاب اشتراک Windscribe</b>\n\nپلن مناسب خود را از گزینه‌های زیر انتخاب کنید 👇",
        { ...inlineKeysWind, parse_mode: "HTML" },
      );
      break;

    case "اکانت WireGuard":
      const inlineKeysWire = createProductKeyboard("wire");
      await bot.sendMessage(
        senderID,
        "⚡️ <b>انتخاب اشتراک WireGuard</b>\n\nیکی از پلن‌های زیر را برای ادامه انتخاب کنید 👇",
        { ...inlineKeysWire, parse_mode: "HTML" },
      );
      break;

    case "اکانت هوش مصنوعی":
      const inlineKeysAI = createProductKeyboard("ai");
      await bot.sendMessage(
        senderID,
        "🤖 <b>اکانت‌های هوش مصنوعی</b>\n\nسرویس موردنظرتان را از فهرست زیر انتخاب کنید 👇",
        { ...inlineKeysAI, parse_mode: "HTML" },
      );
      break;

    case "پشتیبانی":
      await bot.sendMessage(
        senderID,
        '💬 <b>پشتیبانی TelFactory</b>\n\nسؤال یا مشکلی دارید؟ پیام بدهید؛ در اولین فرصت پاسخ‌گوی شما هستیم.\n\n👤 <a href="https://t.me/realhamoon">@realhamoon</a>',
        { parse_mode: "HTML", disable_web_page_preview: true },
      );
      break;

    case "محصولات":
      await bot.sendMessage(senderID, "🛍 <b>محصولات TelFactory</b>\n\nدسته‌بندی موردنظرتان را انتخاب کنید 👇", {
        ...productMenu,
        parse_mode: "HTML",
      });
      break;

    case "بازگشت به منو اصلی":
      await bot.sendMessage(senderID, "🏠 <b>منوی اصلی</b>\n\nچه کاری می‌توانم برایتان انجام دهم؟ 👇", {
        ...mainMenu,
        parse_mode: "HTML",
      });
      break;

    case "حساب کاربری من":
      await displayUserInfo(senderID, senderID);
      break;

    case "دریافت اکانت تست":
      if (!testAccount) {
        await bot.sendMessage(
          senderID,
          "⏳ <b>اکانت تست موقتاً در دسترس نیست</b>\n\nلطفاً کمی بعد دوباره امتحان کنید یا با پشتیبانی در ارتباط باشید.",
          { parse_mode: "HTML" },
        );
        break;
      }

      await bot.sendMessage(
        senderID,
        `🎁 <b>اکانت تست شما آماده است!</b>\n\nبرای کپی‌کردن، روی کادر زیر ضربه بزنید:\n\n<code>${escapeHtml(testAccount)}</code>\n\n✨ امیدواریم از کیفیت سرویس لذت ببرید.`,
        { parse_mode: "HTML" },
      );
      break;

    case "افزایش موجودی":
      await bot.sendMessage(senderID, "💳 <b>افزایش موجودی حساب</b>\n\nروش پرداخت موردنظرتان را انتخاب کنید 👇", {
        ...createInlineKeys(PAYMENT_METHODS),
        parse_mode: "HTML",
      });
      break;

    case "پرداخت از موجودی":
      await payFromBalance(senderID, senderID);
      break;

    case "لغو سفارش":
      await cancelOrder(senderID, senderID);
      break;
  }
}
