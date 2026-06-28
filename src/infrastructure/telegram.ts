import TelegramBot from "node-telegram-bot-api";
import { telegramBotToken } from "../config";

export const bot = new TelegramBot(telegramBotToken, {
  polling: true,
});
