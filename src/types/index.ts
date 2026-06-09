export type UpdateOrderData = {
  product_name?: string;
  amount?: number;
  status?: string;
  email?: string;
  receipt_file_id?: string | null;
  admin_notes?: string | null;
};
