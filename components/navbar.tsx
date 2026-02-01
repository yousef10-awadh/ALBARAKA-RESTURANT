"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBasket, Menu, X, Home, 
  UtensilsCrossed, PhoneCall, Info, Settings, LogIn, Timer 
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [localCount, setLocalCount] = useState<number>(0);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  const { cart } = useCart();
  const pathname = usePathname();

  interface CartItem {
    quantity: number;
    [key: string]: unknown;
  }

  const refreshNavbar = () => {
    try {
      // 1. تحديث عداد السلة
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const items: CartItem[] = JSON.parse(cartData);
        setLocalCount(items.reduce((acc, item) => acc + (item.quantity || 0), 0));
      } else {
        setLocalCount(0);
      }

      // 2. تحديث زر تتبع الطلب
      const savedOrderId = localStorage.getItem("lastOrderId");
      setActiveOrderId(savedOrderId);
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  useEffect(() => {
    refreshNavbar();

    window.addEventListener("cart-updated", refreshNavbar);
    window.addEventListener("order-placed", refreshNavbar);
    window.addEventListener("storage", refreshNavbar);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      window.removeEventListener("cart-updated", refreshNavbar);
      window.removeEventListener("order-placed", refreshNavbar);
      window.removeEventListener("storage", refreshNavbar);
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setTimeout(refreshNavbar, 0);
  }, [cart]);

  const navLinks = [
    { name: "الرئيسية", path: "/", icon: <Home size={18} /> },
    { name: "المنيو", path: "/menu", icon: <UtensilsCrossed size={18} /> },
    { name: "عن البركة", path: "/about", icon: <Info size={18} /> },
    { name: "اتصل بنا", path: "/contact", icon: <PhoneCall size={18} /> },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-[100] w-full" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-4xl">B</div>
            <Link href="/" className="text-2xl font-black text-white tracking-tighter italic">البركة<span className="text-yellow-500">.</span></Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {/* زر تتبع الطلب المباشر */}
            {activeOrderId && (
              <Link 
                href={`/cart/success?id=${activeOrderId}`}
                className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full font-black text-[10px] animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              >
                <Timer size={14} /> تتبع طلبك الآن
              </Link>
            )}

            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className={`flex items-center gap-2 font-bold transition-all ${pathname === link.path ? "text-yellow-500" : "text-gray-400 hover:text-white"}`}>
                {link.icon} {link.name}
              </Link>
            ))}

            {isAdmin ? (
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 px-5 py-2 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all"><Settings size={18} /> لوحة التحكم</Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 font-bold text-gray-400 hover:text-white bg-white/5 px-5 py-2 rounded-2xl border border-white/10 transition-all group"><LogIn size={18} /> دخول الإدارة</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group border border-white/5">
              <ShoppingBasket className="group-hover:text-yellow-500 text-white transition-colors" size={24} />
              {localCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{localCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl">{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/5 p-4 space-y-2">
          {activeOrderId && (
             <Link href={`/cart/success?id=${activeOrderId}`} onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-yellow-500 text-black p-4 rounded-2xl font-black mb-2 animate-pulse"><Timer size={20} /> تتبع طلبك الحالي</Link>
          )}
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl font-bold ${pathname === link.path ? "bg-yellow-500 text-black" : "text-gray-400 hover:bg-white/5"}`}>{link.icon} {link.name}</Link>
          ))}
          <hr className="border-white/5 my-2" />
          {isAdmin ? (
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-yellow-500 bg-yellow-500/10"><Settings size={18} /> لوحة التحكم</Link>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-gray-400 bg-white/5"><LogIn size={18} /> دخول الإدارة</Link>
          )}
        </div>
      )}
    </nav>
  );
}