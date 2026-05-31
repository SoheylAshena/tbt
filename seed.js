// seed.js
import { query } from "./db";

async function seedProducts() {
  try {
    await query(`
            INSERT INTO products (category, name, description, price, is_active)
            VALUES 
                ('vpn', 'VPN 1 ماهه', 'اشتراک VPN پرسرعت ۳۰ روزه', 150000, true),
                ('vpn', 'VPN 3 ماهه', 'اشتراک VPN پرسرعت ۹۰ روزه', 400000, true),
                ('vpn', 'VPN 6 ماهه', 'اشتراک VPN پرسرعت ۱۸۰ روزه', 700000, true),
                
                ('windscribe', 'Windscribe 1 ماهه', 'اکانت Windscribe Pro ۱ ماهه', 120000, true),
                ('windscribe', 'Windscribe 3 ماهه', 'اکانت Windscribe Pro ۳ ماهه', 320000, true),
                
                ('ai', 'ChatGPT Plus 1 ماهه', 'اکانت ChatGPT Plus (GPT-4o)', 250000, true),
                ('ai', 'Claude Pro 1 ماهه', 'اکانت Claude Pro', 280000, true),
                ('ai', 'Midjourney 1 ماهه', 'اکانت Midjourney Basic', 300000, true)
            ON CONFLICT DO NOTHING;
        `);

    console.log("✅ محصولات با موفقیت اضافه شدند!");
  } catch (err) {
    console.error("خطا:", err);
  } finally {
    process.exit();
  }
}

seedProducts();
