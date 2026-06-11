export const PRODUCTS = [
  {
    text: "10 گیگ یک ماهه | 20,000 تومان",
    amount: 20000,
    callback_data: "vpn_1",
    style: "primary",
  },
  {
    text: "نامحدود یک ماهه | 99,000 تومان",
    amount: 99000,
    callback_data: "vpn_2",
    style: "primary",
  },
] as const;

export const PAYMENT_METHODS = [
  {
    text: "کارت به کارت",
    callback_data: "pay_card",
    style: "primary",
  },
  {
    text: "رمز ارز ترون TRX",
    callback_data: "pay_trx",
    style: "primary",
  },
];
