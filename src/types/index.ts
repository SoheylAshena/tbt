export type UpdateOrderData = {
  product_id?: number;
  config_id?: number | null;
  product_name?: string;
  amount?: number;
  status?: string;
  email?: string;
  receipt_file_id?: string | null;
  admin_notes?: string | null;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  price: number;
};

export type PurchaseResult =
  | {
      status: "success";
      orderId: number;
      productName: string;
      config: string;
      newBalance: number;
      newlyPurchased: boolean;
    }
  | { status: "no_user" }
  | { status: "no_order" }
  | { status: "out_of_stock" }
  | { status: "insufficient_balance"; balance: number; amount: number };
