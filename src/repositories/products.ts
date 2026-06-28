import { db } from "../infrastructure/database";
import type { Product } from "../types";

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    price: Number(row.price),
  };
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

export async function getProduct(productId: number) {
  const result = await db.query(
    `SELECT id, code, name, price FROM products WHERE id = $1 AND active = TRUE`,
    [productId],
  );

  return result.rows[0] ? mapProduct(result.rows[0]) : undefined;
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

  return result.rows as Array<{
    code: string;
    name: string;
    available: number;
    sold: number;
  }>;
}
