// src/types/telegram.d.ts

import "node-telegram-bot-api";

declare module "node-telegram-bot-api" {
  interface KeyboardButton {
    style?: "primary" | "success" | "danger";
  }

  interface InlineKeyboardButton {
    style?: "primary" | "success" | "danger";
  }
}
