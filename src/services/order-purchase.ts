import { db } from "../infrastructure/database";
import type { PurchaseResult } from "../types";

export async function purchasePendingOrder(userId: number): Promise<PurchaseResult> {
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(`SELECT balance FROM users WHERE telegram_id = $1 FOR UPDATE`, [userId]);
    if (!userResult.rows[0]) {
      await client.query("ROLLBACK");
      return { status: "no_user" };
    }

    const orderResult = await client.query(
      `
        SELECT o.id, o.amount, o.product_id, o.product_name
        FROM orders o
        WHERE o.user_id = $1 AND o.status = 'pending_payment'
        ORDER BY o.created_at DESC
        LIMIT 1
        FOR UPDATE
      `,
      [userId],
    );
    const order = orderResult.rows[0];

    if (!order) {
      const paidOrderResult = await client.query(
        `
          SELECT o.id, o.product_name, pc.config_text
          FROM orders o
          JOIN product_configs pc ON pc.id = o.config_id
          WHERE o.user_id = $1 AND o.status = 'paid'
          ORDER BY o.updated_at DESC
          LIMIT 1
        `,
        [userId],
      );
      const paidOrder = paidOrderResult.rows[0];
      await client.query("ROLLBACK");

      if (paidOrder) {
        return {
          status: "success",
          orderId: Number(paidOrder.id),
          productName: String(paidOrder.product_name),
          config: String(paidOrder.config_text),
          newBalance: Number(userResult.rows[0].balance),
          newlyPurchased: false,
        };
      }

      return { status: "no_order" };
    }

    const balance = Number(userResult.rows[0].balance);
    const amount = Number(order.amount);
    if (balance < amount) {
      await client.query("ROLLBACK");
      return { status: "insufficient_balance", balance, amount };
    }

    const configResult = await client.query(
      `
        SELECT id, config_text
        FROM product_configs
        WHERE product_id = $1 AND assigned_order_id IS NULL
        ORDER BY id
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `,
      [order.product_id],
    );
    const productConfig = configResult.rows[0];
    if (!productConfig) {
      await client.query("ROLLBACK");
      return { status: "out_of_stock" };
    }

    const newBalance = balance - amount;
    await client.query(`UPDATE users SET balance = $1 WHERE telegram_id = $2`, [newBalance, userId]);
    await client.query(
      `
        UPDATE product_configs
        SET assigned_order_id = $1, assigned_user_id = $2, assigned_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `,
      [Number(order.id), userId, Number(productConfig.id)],
    );
    await client.query(
      `
        UPDATE orders
        SET status = 'paid', config_id = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `,
      [Number(productConfig.id), Number(order.id)],
    );
    await client.query("COMMIT");

    return {
      status: "success",
      orderId: Number(order.id),
      productName: String(order.product_name),
      config: String(productConfig.config_text),
      newBalance,
      newlyPurchased: true,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
