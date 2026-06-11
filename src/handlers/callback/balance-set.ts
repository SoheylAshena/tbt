import { adminReplyMode, bot, waitingForBalance } from "../../config";
import { getUserData, updateUserBalance } from "../../utils/database-helpers";

export async function adminBalanceSetHandler(message: string, adminID: number, chatID: number) {
  if (adminReplyMode.get(adminID)) {
    adminReplyMode.delete(adminID);
  }

  const targetUserID = waitingForBalance.get(adminID);
  if (!targetUserID) return;

  waitingForBalance.delete(adminID);

  const targetUserData = await getUserData(targetUserID);

  const currentUserBalance = Number(targetUserData.balance);
  const addedBalance = Number(message.trim());

  const finalBalance = currentUserBalance + addedBalance;

  await updateUserBalance(targetUserID, finalBalance);

  await bot.sendMessage(
    chatID,
    `موجودی شما افزایش یافت،
موجودی: ${finalBalance}
`,
  );
}
