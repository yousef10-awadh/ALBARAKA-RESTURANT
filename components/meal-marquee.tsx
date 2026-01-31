"use client";

import React from "react";

// تعريف الـ Interface لاستقبال البيانات
interface Meal {
  name: string;
  image: string;
  price: number;
}

interface MealMarqueeProps {
  meals: Meal[];
}

export default function MealMarquee({ meals }: MealMarqueeProps) {
  // إذا كانت المصفوفة فارغة لا نعرض شيئاً لتجنب الأخطاء
  if (!meals || meals.length === 0) return null;

  // نكرر المصفوفة مرتين لضمان استمرار الحركة بشكل انسيابي (Infinite Loop)
  const mealsRow = [...meals, ...meals];

  const marqueeStyle = `
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes scrollRight {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
    .animate-slow-left {
      display: flex;
      width: max-content;
      animation: scrollLeft 100s linear infinite;
    }
    .animate-slow-right {
      display: flex;
      width: max-content;
      animation: scrollRight 100s linear infinite;
    }
    .pause-hover:hover {
      animation-play-state: paused;
    }
  `;

  return (
    <section className="py-10 overflow-hidden flex flex-col gap-12">
      <style>{marqueeStyle}</style>

      {/* الصف الأول - يتحرك لليسار */}
      <div className="flex overflow-hidden">
        <div className="animate-slow-left pause-hover">
          {mealsRow.map((meal, i) => (
            <div key={`left-${i}`} className="w-[300px] h-[200px] mx-4 rounded-[2rem] overflow-hidden border border-white/10 relative group cursor-pointer bg-muted">
              <img 
                src={meal.image} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                alt={meal.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <p className="text-white font-bold text-lg">{meal.name}</p>
                 <p className="text-primary font-black">${meal.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}