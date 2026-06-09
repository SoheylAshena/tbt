export const PRODUCTS = [
  {
    text: "10 گیگ",
    amount: 50000,
    callback_data: "vpn_1",
    style: "primary",
  },
  {
    text: "30 گیگ",
    amount: 120000,
    callback_data: "vpn_2",
    style: "primary",
  },
  {
    text: "50 گیگ",
    amount: 175000,
    callback_data: "vpn_3",
    style: "primary",
  },
  {
    text: "100 گیگ",
    amount: 250000,
    callback_data: "vpn_4",
    style: "primary",
  },
  {
    text: "نامحدود",
    amount: 350000,
    callback_data: "vpn_5",
    style: "primary",
  },
  {
    text: "سرویس گیمینگ: 1 گیگ",
    amount: 250000,
    callback_data: "vpn_6",
    style: "primary",
  },
  {
    text: "وایرگارد نامحدود دوکاربره",
    amount: 690000,
    callback_data: "wire_1",
    style: "primary",
  },
  {
    text: "ویندسکرایب نامحدود تک کاربره",
    amount: 325000,
    callback_data: "wind_1",
    style: "primary",
  },
  {
    text: "هوش مصنوعی gemini",
    amount: 590000,
    callback_data: "ai_1",
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
