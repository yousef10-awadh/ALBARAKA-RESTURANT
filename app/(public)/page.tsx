"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Utensils, Clock, MapPin } from "lucide-react";
import MealMarquee from "@/components/meal-marquee";

// تعريف نوع البيانات للوجبة
interface Meal {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);

  // جلب الوجبات من Supabase عند تحميل الصفحة
  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .limit(10); // نجلب أول 10 وجبات فقط للشريط المتحرك
      
      if (!error && data) {
        setMeals(data);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974" 
          className="absolute inset-0 w-full h-full object-cover scale-110"
          alt="Restaurant Hero"
        />
        
        <div className="relative z-20 text-center max-w-4xl">
          <h1 className="text-7xl md:text-9xl font-black italic mb-8 tracking-tighter leading-none">
            مـطعم <span className="text-yellow-500">الـبركـة</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-medium max-w-2xl mx-auto italic leading-relaxed">
            استمتع بأشهى المأكولات التقليدية المحضرة بكل حب وإتقان في قلب عدن.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/menu" className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-yellow-400 transition-all active:scale-95 flex items-center gap-2">
              اطلب الآن <ChevronLeft size={24} />
            </Link>
            <Link href="/about" className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all active:scale-95">
              قصتنا
            </Link>
          </div>
        </div>
      </section>

      {/* مكوّن الماركي (المتحرك) - الآن يعرض وجباتك الحقيقية */}
      <div className="py-10 border-y border-white/5 bg-[#050505]">
        {meals.length > 0 ? (
          <MealMarquee meals={meals} />
        ) : (
          <div className="text-center text-gray-600 animate-pulse font-bold">جاري تحميل أشهى الوجبات...</div>
        )}
      </div>

      {/* Quick Info */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Utensils className="text-yellow-500" />, title: "أجود المكونات", desc: "نستخدم اللحوم الطازجة والخضروات العضوية يومياً." },
            { icon: <Clock className="text-yellow-500" />, title: "توصيل سريع", desc: "نصلك أينما كنت في عدن بأسرع وقت ممكن." },
            { icon: <MapPin className="text-yellow-500" />, title: "موقعنا", desc: "عدن - شارع التسعين - بجوار مجمع البركة." }
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem] hover:border-yellow-500/20 transition-all text-center group">
              <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 italic">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}