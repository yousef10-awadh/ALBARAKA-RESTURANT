"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Plus, Minus, Ticket, CheckCircle2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0); 
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) setCart(JSON.parse(cartData));
  }, []);

  const sendToTelegram = async (orderId: number, items: CartItem[], total: number) => {
    const BOT_TOKEN = "8597171437:AAFxlCSKX81fwiRO-kKFbBaxIcIqbeY8M3s";
    const CHAT_ID = "8015552200";

    const message = `
🔔 *طلب جديد - مطعم البركة*
--------------------------
🆔 رقم الطلب: ${orderId}
🍱 الوجبات:
${items.map(item => `• ${item.name} (${item.quantity})`).join('\n')}

💰 الإجمالي: *${total.toLocaleString()} ر.ي*
--------------------------
⏱ الوقت: ${new Date().toLocaleTimeString('ar-YE')}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (error) {
      console.error("Telegram Error:", error);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("السلة فارغة يا وحش!");
    
    setIsSubmitting(true);
    const orderTotal = subTotal - discountAmount;

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([{ 
          items: cart, 
          total_price: orderTotal, 
          status: 'قيد الانتظار',
          promo_code: isPromoApplied ? promoCode : null 
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await sendToTelegram(data.id, cart, orderTotal);
        
        // --- حفظ رقم الطلب للنافبار ---
        localStorage.setItem("lastOrderId", data.id.toString());
        localStorage.setItem("lastOrderTotal", orderTotal.toString());
        
        localStorage.removeItem("cart");
        setCart([]);
        
        // إرسال تنبيهات لتحديث النافبار (السلة وتتبع الطلب)
        window.dispatchEvent(new Event("cart-updated"));
        window.dispatchEvent(new Event("order-placed"));

        router.push(`/cart/success?id=${data.id}&total=${orderTotal}`);
        toast.success("تم إرسال طلبك بنجاح!");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success("تم الحذف من السلة");
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    const { data } = await supabase.from("coupons").select("*").eq("code", promoCode.toUpperCase()).eq("is_active", true).single();
    if (data) {
      setDiscount(data.discount_percent);
      setIsPromoApplied(true);
      toast.success(`تم تطبيق خصم ${data.discount_percent}%!`);
    } else {
      toast.error("كود غير صالح");
    }
  };

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = (subTotal * discount) / 100;
  const total = subTotal - discountAmount;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans" dir="rtl">
      <h1 className="text-4xl font-black mb-12 italic text-center md:text-right">سلة <span className="text-yellow-500">الطلبات</span></h1>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-yellow-500 font-black">{item.price} ر.ي</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-yellow-500"><Minus size={18} /></button>
                  <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-yellow-500"><Plus size={18} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-dashed border-white/10">
               <ShoppingBag size={48} className="mx-auto mb-4 text-gray-700" />
               <p className="text-gray-500 font-bold">السلة فارغة حالياً.. اطلب شيئاً لذيذاً! 🛒</p>
            </div>
          )}
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] h-fit sticky top-24">
          <h2 className="text-2xl font-black mb-8">ملخص الحساب</h2>
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-500 mb-2 block mr-2">لديك كود خصم؟</label>
            <div className="relative">
              <input type="text" placeholder="أدخل الكود هنا..." value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={isPromoApplied} className="w-full bg-black border border-white/10 p-4 pr-12 rounded-2xl outline-none focus:border-yellow-500 font-bold disabled:opacity-50" />
              <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <button onClick={applyPromoCode} disabled={isPromoApplied} className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-yellow-400 disabled:bg-green-500 transition-all">
                {isPromoApplied ? <CheckCircle2 size={16} /> : "تطبيق"}
              </button>
            </div>
          </div>
          <div className="space-y-4 mb-8 border-b border-white/5 pb-8">
            <div className="flex justify-between text-gray-400 font-bold"><span>المجموع الفرعي</span><span>{subTotal.toLocaleString()} ر.ي</span></div>
            {discount > 0 && <div className="flex justify-between text-green-500 font-bold"><span>الخصم ({discount}%)</span><span>-{discountAmount.toLocaleString()} ر.ي</span></div>}
            <div className="flex justify-between text-2xl font-black text-white pt-4 border-t border-white/5"><span>الإجمالي</span><span className="text-yellow-500">{total.toLocaleString()} ر.ي</span></div>
          </div>
          <button onClick={handleCheckout} disabled={isSubmitting || cart.length === 0} className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-xl hover:bg-yellow-500 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "جاري الإرسال..." : "إتمام الطلب الآن"}
          </button>
        </div>
      </div>
    </div>
  );
}