import type TelegramBot from "node-telegram-bot-api";

type Btn = TelegramBot.KeyboardButton;

export const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "محصولات", style: "primary" }],
      [{ text: "حساب کاربری من" }],
      [{ text: "پشتیبانی" }],
    ] satisfies Btn[][],
    resize_keyboard: true,
  },
};
export const productMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "VPN", style: "primary" }],
      [{ text: "اکانت Windscribe", style: "primary" }],
      [{ text: "اکانت WireGuard", style: "primary" }],
      [{ text: "اکانت هوش مصنوعی", style: "primary" }],
      [{ text: "بازگشت به منو اصلی", style: "success" }],
    ] satisfies Btn[][],
    resize_keyboard: true,
  },
};

export const pendingOrderMenu = {
  reply_markup: {
    keyboard: [[{ text: "لغو سفارش", style: "danger" }]] satisfies Btn[][],
    resize_keyboard: true,
  },
};
