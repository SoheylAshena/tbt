import { User } from "node-telegram-bot-api";
import { db } from "../config";

export async function getUserId(user: User): Promise<number> {
  const result = await db.query(
    `
      INSERT INTO users (
        telegram_id,
        username,
        first_name,
        updated_at
      )
      VALUES ($1,$2,$3,CURRENT_TIMESTAMP)

      ON CONFLICT (telegram_id)
      DO UPDATE SET
        username = COALESCE(EXCLUDED.username, users.username),
        first_name = COALESCE(EXCLUDED.first_name, users.first_name),
        updated_at = CURRENT_TIMESTAMP

      RETURNING telegram_id
    `,
    [user.id, user.username ?? null, user.first_name ?? null],
  );

  return result.rows[0].telegram_id;
}

export async function deleteUserPendingOrder(userId: number) {
  const result = await db.query(
    `
     DELETE FROM orders
WHERE user_id = $1
AND status IN (
  'pending_payment',
  'waiting_email'
)
      RETURNING id
    `,
    [userId],
  );

  return result;
}

export async function getUserData(userId: number) {
  const result = await db.query(
    `
      SELECT * FROM users WHERE telegram_id = $1
    `,
    [userId],
  );

  return result.rows[0];
}
