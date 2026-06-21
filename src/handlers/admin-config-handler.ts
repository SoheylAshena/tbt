import { type Message } from "node-telegram-bot-api";
import { adminIDs, bot } from "../config";
import { addProductConfig, getProductStock } from "../utils/database-helpers";

const PRODUCT_CODES = new Set(["10gb", "unlimited"]);

export async function handleAddConfigCommand(msg: Message, match: RegExpExecArray | null) {
  const adminID = msg.from?.id;
  if (!adminID || !adminIDs.includes(adminID)) return;

  const input = match?.[1]?.trim() ?? "";
  const separator = input.search(/\s/);
  const productCode = (separator === -1 ? input : input.slice(0, separator)).toLowerCase();
  const config = separator === -1 ? "" : input.slice(separator).trim();

  if (!PRODUCT_CODES.has(productCode) || !config) {
    await bot.sendMessage(
      msg.chat.id,
      "فرمت صحیح:\n<code>/addconfig 10gb CONFIG</code>\nیا\n<code>/addconfig unlimited CONFIG</code>\n\nمی‌توانید کانفیگ را در خط بعد از نام محصول هم قرار دهید.",
      { parse_mode: "HTML" },
    );
    return;
  }

  const configID = await addProductConfig(productCode, config);
  if (!configID) {
    await bot.sendMessage(msg.chat.id, "این کانفیگ قبلاً ثبت شده یا محصول فعال نیست.");
    return;
  }

  await bot.sendMessage(msg.chat.id, `✅ کانفیگ برای محصول ${productCode} ثبت شد.\nشناسه موجودی: #${configID}`);
}

export async function handleStockCommand(msg: Message) {
  const adminID = msg.from?.id;
  if (!adminID || !adminIDs.includes(adminID)) return;

  const stock = await getProductStock();
  const lines = stock.map(
    (product) => `${product.name} (${product.code})\nآماده فروش: ${product.available} | فروخته‌شده: ${product.sold}`,
  );

  await bot.sendMessage(msg.chat.id, `📦 وضعیت موجودی\n\n${lines.join("\n\n") || "محصولی ثبت نشده است."}`);
}
