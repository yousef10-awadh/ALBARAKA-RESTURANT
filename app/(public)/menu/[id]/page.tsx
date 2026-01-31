"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShoppingCart, Star, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Meal {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string; // أضفنا الوصف إذا كان موجوداً
}

export default function MealDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("id", id)
        .single(); // جلب سجل واحد فقط [cite: 2026-01-25]

      if (error || !data) {
        router.push("/menu");
      } else {
        setMeal(data as Meal);
      }
      setLoading(false);
    };

    fetchMeal();
  }, [id, router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;
  if (!meal) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* زر العودة */}
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
          <ArrowRight size={20} />
          العودة للمنيو
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* صورة الوجبة */}
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 right-6 bg-yellow-500 text-black px-6 py-2 rounded-full font-black">
              {meal.category}
            </div>
          </div>

          {/* تفاصيل الوجبة */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-yellow-500 mb-4">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <span className="text-gray-400 text-sm mr-2">(4.9 تقييم الزبائن)</span>
            </div>

            <h1 className="text-5xl font-black mb-6 italic">{meal.name}</h1>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {meal.description || "هذه الوجبة محضرة من أجود المكونات الطازجة يومياً لتستمتع بمذاق البركة الفريد. نضمن لك جودة المكونات وسرعة التحضير."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                <Clock className="text-yellow-500" />
                <span>تحضير في 15 دقيقة</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                <ShieldCheck className="text-yellow-500" />
                <span>مكونات طازجة 100%</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/5 p-6 rounded-[2.5rem]">
              <span className="text-4xl font-black text-yellow-500">${meal.price}</span>
              <button 
                onClick={() => addToCart(meal)}
                className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-yellow-500 transition-all active:scale-95 shadow-xl"
              >
                <ShoppingCart size={22} />
                إضافة للسلة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}