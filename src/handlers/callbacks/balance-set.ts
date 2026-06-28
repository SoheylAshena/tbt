import { bot } from "../../infrastructure/telegram";
import { getUserData, updateUserBalance } from "../../repositories/users";
import { waitingForBalance } from "../../shared/state";

export async function adminBalanceSetHandler(message: string, adminID: number) {
  const targetUserID = waitingForBalance.get(adminID);
  if (!targetUserID) return;

  waitingForBalance.delete(adminID);

  const targetUserData = await getUserData(targetUserID);

  const currentUserBalance = Number(targetUserData.balance);
  const addedBalance = Number(message.trim());

  const finalBalance = currentUserBalance + addedBalance;

  await updateUserBalance(targetUserID, finalBalance);

  await bot.sendMessage(
    targetUserID,
    `✅ <b>موجودی حساب شما افزایش یافت</b>

💰 موجودی جدید: <b>${finalBalance.toLocaleString("fa-IR")} تومان</b>`,
    { parse_mode: "HTML" },
  );

  await bot.sendMessage(
    adminID,
    `✅ <b>افزایش موجودی با موفقیت انجام شد</b>

👤 شناسه کاربر: <code>${targetUserID}</code>
💰 موجودی جدید: <b>${finalBalance.toLocaleString("fa-IR")} تومان</b>`,
    { parse_mode: "HTML" },
  );
}
