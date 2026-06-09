import { User } from "node-telegram-bot-api";
import { db } from "../config";
import { UpdateOrderData } from "../types";

export async function getUserData(userId: number) {
  const result = await db.query(
    `
      SELECT * FROM users WHERE telegram_id = $1
    `,
    [userId],
  );

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
        VALUES ($1,$2,$3,CURRENT_TIMESTAMP)

      ON CONFLICT (telegram_id)
      DO UPDATE SET
        username = COALESCE(EXCLUDED.username, users.username),
        first_name = COALESCE(EXCLUDED.first_name, users.first_name),
        updated_at = CURRENT_TIMESTAMP
    `,
    [user.id, user.username ?? null, user.first_name ?? null],
  );
}

export async function createOrder(senderID: number, productTitle: string, productAmount: number) {
  console.log(senderID);
  const createdOrder = await db.query(
    `
      INSERT INTO orders (
        user_id,
        product_name,
        amount,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        'pending_payment',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `,
    [senderID, productTitle, productAmount],
  );

  return createdOrder.rows[0].id;
}

export async function getUserPendingOrder(senderID: number) {
  const order = await db.query(
    `
   SELECT *
FROM orders
WHERE user_id = $1
AND status IN (
  'pending_payment'
)
  `,
    [senderID],
  );

  return order.rows[0];
}

export async function getUserExistingOrderID(senderID: number) {
  const result = await db.query(
    `
    SELECT id
    FROM orders
    WHERE user_id = $1
      AND status IN ('pending_payment', 'waiting_email')
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [senderID],
  );

  return result.rows[0]?.id;
}

export async function deleteUserExistingOrder(userId: number) {
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

export async function updateOrder(orderID: number, updates: UpdateOrderData) {
  const fields = Object.entries(updates);
  if (fields.length === 0) return;

  const setClauses = fields.map(([column], index) => `${column} = $${index + 1}`);

  const values = fields.map(([, value]) => value);

  await db.query(
    `
      UPDATE orders
      SET
        ${setClauses.join(", ")},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
    `,
    [...values, orderID],
  );
}

export async function getOrderData(orderID: number) {
  const result = await db.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1
    `,
    [orderID],
  );

  return result.rows[0];
}
