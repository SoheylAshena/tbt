const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "🛒 خرید VPN" }],
      [{ text: "🛒 خرید اکانت Windscribe" }],
      [{ text: "🛒 خرید اکانت هوش مصنوعی" }],
      [{ text: "📋 سفارش‌های من" }],
    ],
    resize_keyboard: true,
  },
};

const vpnTypes = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "1 ماهه - ۱۵۰ هزار تومان", callback_data: "vpn_1m_150000" }],
      [{ text: "3 ماهه - ۴۰۰ هزار تومان", callback_data: "vpn_3m_400000" }],
      [{ text: "6 ماهه - ۷۰۰ هزار تومان", callback_data: "vpn_6m_700000" }],
      [{ text: "🔙 بازگشت", callback_data: "back_to_main" }],
    ],
  },
};

// بعداً کیبوردهای Windscribe و AI رو هم اضافه می‌کنیم
export { mainMenu, vpnTypes };
