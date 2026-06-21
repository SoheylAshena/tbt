import { type KeyboardButton, type SendMessageOptions } from "node-telegram-bot-api";
import { PRODUCTS } from "../constants";

type ProductButton = {
  text: string;
  callback_data: string;
};

export function createInlineKeys(data: ProductButton[]) {
  return {
    reply_markup: {
      inline_keyboard: [...data.map((item) => [item])],
    },
  };
}

export function createProductKeyboard(keyword: string) {
  const products = PRODUCTS.filter((item) => item.callback_data.startsWith(keyword));

  return createInlineKeys(products);
}

type Keyboard = KeyboardButton[][];

export function createMenu(keyboard: Keyboard): SendMessageOptions {
  return {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
    },
  };
}
