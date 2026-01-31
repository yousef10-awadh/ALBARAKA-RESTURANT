"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Search, X, Flame, ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { CartItem } from "@/types";

interface Meal { 
  id: number; 
  name: string; 
  price: number; 
  category: string; 
  image: string; 
  description?: string; 
}

export default function MenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [bestSellers, setBestSellers] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ["الكل", "وجبات", "بيتزا", "برجر", "شاورما", "مقبلات", "مشروبات"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. جلب الوجبات من قاعدة البيانات
      const { data: mealsData } = await supabase
        .from("meals")
        .select("*")
        .order("id", { ascending: false });
      
      if (mealsData) setMeals(mealsData);

      // 2. تحليل الأكثر طلباً بناءً على آخر 50 طلب
      const { data: ordersData } = await supabase
        .from("orders")
        .select("items")
        .limit(50);
      
      if (ordersData) {
        const counts: { [key: number]: number } = {};
        ordersData.forEach(order => {
          const items = order.items as CartItem[];
          if (Array.isArray(items)) {
            items.forEach(item => {
              counts[item.id] = (counts[item.id] || 0) + 1;
            });
          }
        });

        // الوجبات التي تكررت أكثر من مرتين تعتبر Best Seller
        const popularIds = Object.keys(counts)
          .filter(id => counts[parseInt(id)] >= 2)
          .map(Number);
        setBestSellers(popularIds);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // دالة الفلترة والبحث
  const filteredMeals = meals.filter(m => {
    const matchesCategory = activeCategory === "الكل" || m.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // دالة الإضافة للسلة
  const handleAddToCart = (meal: Meal) => {
    const cartData = localStorage.getItem("cart");
    const cart = cartData ? JSON.parse(cartData) : [];
    const existingIndex = cart.findIndex((item: CartItem) => item.id === meal.id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...meal, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`أضيفت ${meal.name} للسلة`, {
      style: { background: '#111', color: '#fff', borderRadius: '15px', border: '1px solid #333' }
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20 select-none" dir="rtl">
      
      {/* Header الثابت: البحث والتصنيفات */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 p-6 space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="ابحث عن وجبتك المفضلة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 py-4 pr-12 pl-4 rounded-[1.5rem] focus:outline-none focus:border-yellow-500 transition-all text-lg font-bold"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 max-w-4xl mx-auto">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105" 
                : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* قائمة الوجبات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto mt-8">
        {filteredMeals.length > 0 ? (
          filteredMeals.map(meal => {
            const isBestSeller = bestSellers.includes(meal.id);
            return (
              <div key={meal.id} className="relative bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 shadow-2xl">
                
                {/* تاق الأكثر طلباً */}
                {isBestSeller && (
                  <div className="absolute top-5 right-5 z-20 bg-yellow-500 text-black px-4 py-1.5 rounded-full font-black text-[10px] flex items-center gap-1.5 shadow-xl animate-pulse">
                    <Flame size={12} fill="black" /> الأكثر طلباً
                  </div>
                )}

                {/* صورة الوجبة باستخدام Next Image للسرعة */}
                <div className="relative h-72 cursor-pointer overflow-hidden" onClick={() => setSelectedMeal(meal)}>
                  <Image 
                    src={meal.image} 
                    alt={meal.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                </div>

                <div className="p-8 relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black tracking-tight">{meal.name}</h3>
                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      {meal.category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-10">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs font-bold mb-1 italic text-right">السعر</span>
                      <span className="text-3xl font-black text-yellow-500 tracking-tighter">{meal.price} <span className="text-sm font-medium">ر.ي</span></span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(meal)} 
                      className="bg-white text-black h-14 px-8 rounded-2xl font-black hover:bg-yellow-500 transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                    >
                      <Plus size={20} strokeWidth={3} /> إضافة
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-32 bg-[#0a0a0a] rounded-[3rem] border border-dashed border-white/5">
            <ShoppingBasket size={64} className="mx-auto mb-6 text-gray-800" />
            <p className="text-gray-500 text-xl font-bold italic font-sans">لم نجد وجبة بهذا الاسم.. جرب طلب برجر 🥘</p>
          </div>
        )}
      </div>

      {/* نافذة تفاصيل الوجبة (Modal) */}
      {selectedMeal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedMeal(null)}>
          <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            <div className="relative h-96">
              <Image src={selectedMeal.image} alt="" fill className="object-cover" />
              <button onClick={() => setSelectedMeal(null)} className="absolute top-6 left-6 bg-black/50 p-3 rounded-full text-white backdrop-blur-md hover:bg-yellow-500 hover:text-black transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-12 text-right">
              <h2 className="text-4xl font-black mb-6 tracking-tighter">{selectedMeal.name}</h2>
              <p className="text-gray-400 mb-10 leading-relaxed text-xl italic font-medium">
                {selectedMeal.description || "نقدم لكم مذاق البركة الأصيل المحضر من أجود المكونات الطازجة يومياً لضمان تجربة طعام لا تُنسى في قلب عدن."}
              </p>
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem]">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm font-bold mb-1">الإجمالي</span>
                  <span className="text-4xl font-black text-yellow-500 tracking-tighter">{selectedMeal.price} ر.ي</span>
                </div>
                <button 
                  onClick={() => { handleAddToCart(selectedMeal); setSelectedMeal(null); }} 
                  className="bg-yellow-500 text-black px-12 py-5 rounded-[1.5rem] font-black text-xl hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/20"
                >
                  أضف للطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}