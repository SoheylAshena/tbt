import type { User } from "node-telegram-bot-api";
import { db } from "../infrastructure/database";

export async function getUserData(userId: number) {
  const result = await db.query(`SELECT * FROM users WHERE telegram_id = $1`, [userId]);

  return result.rows[0];
}

export async function createUser(user: User) {
  await db.query(
    `
      INSERT INTO users (
        telegram_id,
        username,
        first_name,
        updated_at
      )
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (telegram_id)
      DO UPDATE SET
        username = COALESCE(EXCLUDED.username, users.username),
        first_name = COALESCE(EXCLUDED.first_name, users.first_name),
        updated_at = CURRENT_TIMESTAMP
    `,
    [user.id, user.username ?? null, user.first_name ?? null],
  );
}

export async function updateUserBalance(userId: number, newBalance: number) {
  await db.query(`UPDATE users SET balance = $1 WHERE telegram_id = $2`, [newBalance, userId]);
}
