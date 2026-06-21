import { createMenu } from "./utils/keyboard-helpers";

export const mainMenu = createMenu([
  [
    { text: "محصولات", style: "primary" },
    { text: "افزایش موجودی", style: "success" },
  ],
  [{ text: "حساب کاربری من" }],
  [{ text: "پشتیبانی" }],
]);

export const productMenu = createMenu([
  [{ text: "V2ray VPN", style: "primary" }],
  [{ text: "بازگشت به منو اصلی", style: "success" }],
]);

export const pendingOrderMenu = createMenu([
  [
    { text: "پرداخت از موجودی", style: "success" },
    { text: "لغو سفارش", style: "danger" },
  ],
]);

export const waitingEmailMenu = createMenu([[{ text: "لغو سفارش", style: "danger" }]]);
