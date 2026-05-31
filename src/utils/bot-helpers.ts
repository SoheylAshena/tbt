import { bot } from "../config";

const CHANNEL_ID = process.env.CHANNEL_ID!;

export async function isUserJoined(userId: number) {
  try {
    const member = await bot.getChatMember(CHANNEL_ID, userId);

    return ["member", "administrator", "creator"].includes(member.status);
  } catch {
    return false;
  }
}

export async function requireJoin(chatId: number, userId: number) {
  const joined = await isUserJoined(userId);

  if (joined) return true;

  await bot.sendMessage(
    chatId,
    "❌ برای استفاده از ربات ابتدا عضو کانال شوید.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 عضویت در کانال",
              url: "https://t.me/WindCelll",
            },
          ],
          [
            {
              text: "✅ بررسی عضویت",
              callback_data: "check_join",
            },
          ],
        ],
      },
    },
  );

  return false;
}
