import { User } from "node-telegram-bot-api";
import { db } from "../config";
import { Product, PurchaseResult, UpdateOrderData } from "../types";

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    price: Number(row.price),
  };
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

export async function updateUserBalance(userID: number, newBalance: number) {
  await db.query(
    `
    UPDATE users SET balance = $1 WHERE telegram_id = $2
`,
    [newBalance, userID],
  );
}

export async function getAvailableProducts() {
  const result = await db.query(`
    SELECT p.id, p.code, p.name, p.price
    FROM products p
    WHERE p.active = TRUE
      AND EXISTS (
        SELECT 1
        FROM product_configs pc
        WHERE pc.product_id = p.id AND pc.assigned_order_id IS NULL
      )
    ORDER BY p.sort_order, p.id
  `);

  return result.rows.map(mapProduct);
}

export async function getProduct(productID: number) {
  const result = await db.query(
    `SELECT id, code, name, price FROM products WHERE id = $1 AND active = TRUE`,
    [productID],
  );

  return result.rows[0] ? mapProduct(result.rows[0]) : undefined;
}

export async function createOrder(senderID: number, product: Product) {
  const createdOrder = await db.query(
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
      VALUES (
        $1,
        $2,
        $3,
        $4,
        'pending_payment',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `,
    [senderID, product.id, product.name, product.price],
  );

  return createdOrder.rows[0].id;
}

export async function addProductConfig(productCode: string, config: string) {
  const result = await db.query(
    `
      INSERT INTO product_configs (product_id, config_text)
      SELECT id, $2 FROM products WHERE code = $1 AND active = TRUE
      ON CONFLICT (config_text) DO NOTHING
      RETURNING id
    `,
    [productCode, config],
  );

  return result.rows[0]?.id as number | undefined;
}

export async function getProductStock() {
  const result = await db.query(`
    SELECT
      p.code,
      p.name,
      COUNT(pc.id) FILTER (WHERE pc.assigned_order_id IS NULL)::int AS available,
      COUNT(pc.id) FILTER (WHERE pc.assigned_order_id IS NOT NULL)::int AS sold
    FROM products p
    LEFT JOIN product_configs pc ON pc.product_id = p.id
    GROUP BY p.id
    ORDER BY p.sort_order, p.id
  `);

  return result.rows as Array<{ code: string; name: string; available: number; sold: number }>;
}

export async function purchasePendingOrder(userID: number): Promise<PurchaseResult> {
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `SELECT balance FROM users WHERE telegram_id = $1 FOR UPDATE`,
      [userID],
    );
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
      [userID],
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
        [userID],
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
    await client.query(`UPDATE users SET balance = $1 WHERE telegram_id = $2`, [newBalance, userID]);
    await client.query(
      `
        UPDATE product_configs
        SET assigned_order_id = $1, assigned_user_id = $2, assigned_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `,
      [Number(order.id), userID, Number(productConfig.id)],
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
