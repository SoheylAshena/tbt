import { db } from "../infrastructure/database";
import type { Product, UpdateOrderData } from "../types";

export async function createOrder(senderId: number, product: Product) {
  const result = await db.query(
    `
      INSERT INTO orders (
        user_id,
        product_id,
        product_name,
        amount,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, 'pending_payment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id
    `,
    [senderId, product.id, product.name, product.price],
  );

  return result.rows[0].id;
}

export async function getUserPendingOrder(senderId: number) {
  const result = await db.query(
    `
      SELECT *
      FROM orders
      WHERE user_id = $1 AND status IN ('pending_payment')
    `,
    [senderId],
  );

  return result.rows[0];
}

export async function getUserExistingOrderID(senderId: number) {
  const result = await db.query(
    `
      SELECT id
      FROM orders
      WHERE user_id = $1
        AND status IN ('pending_payment', 'waiting_email')
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [senderId],
  );

  return result.rows[0]?.id;
}

export async function deleteUserExistingOrder(userId: number) {
  return db.query(
    `
      DELETE FROM orders
      WHERE user_id = $1
        AND status IN ('pending_payment', 'waiting_email')
      RETURNING id
    `,
    [userId],
  );
}

export async function updateOrder(orderId: number, updates: UpdateOrderData) {
  const fields = Object.entries(updates);
  if (fields.length === 0) return;

  const setClauses = fields.map(([column], index) => `${column} = $${index + 1}`);
  const values = fields.map(([, value]) => value);

  await db.query(
    `
      UPDATE orders
      SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
    `,
    [...values, orderId],
  );
}

export async function getOrderData(orderId: number) {
  const result = await db.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderId],
  );

  return result.rows[0];
}
