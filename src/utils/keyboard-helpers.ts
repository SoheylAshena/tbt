import { type KeyboardButton, type SendMessageOptions } from "node-telegram-bot-api";

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

type Keyboard = KeyboardButton[][];

export function createMenu(keyboard: Keyboard): SendMessageOptions {
  return {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
    },
  };
}
