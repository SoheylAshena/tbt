import { bot } from "../../infrastructure/telegram";
import { mainMenu } from "../../ui/menus";

export async function backToMainMenuHandler(data: string, chatID: number) {
  if (data === "back_to_main") {
    await bot.sendMessage(chatID, "🏠 <b>منوی اصلی</b>\n\nچه کاری می‌توانم برایتان انجام دهم؟ 👇", {
      ...mainMenu,
      parse_mode: "HTML",
    });
  }
}
