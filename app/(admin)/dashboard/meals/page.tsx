"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, X, Image as ImageIcon, Search } from "lucide-react";
import toast from "react-hot-toast";

interface Meal {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function AdminMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  
  const [mealForm, setMealForm] = useState({
    name: "",
    price: "",
    category: "وجبات",
    imageName: "" // اسم الصورة فقط (مثلاً pizza.jpg)
  });

  const fetchMeals = async () => {
    const { data } = await supabase.from("meals").select("*").order("id", { ascending: false });
    if (data) setMeals(data);
  };

  useEffect(() => { fetchMeals(); }, []);

  const handleSubmitMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // بناء رابط الصورة تلقائياً بناءً على اسم الملف المرفوع في سوبا بيس
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/meals/images/${mealForm.imageName}`;

    const mealData = {
      name: mealForm.name,
      price: parseInt(mealForm.price),
      category: mealForm.category,
      image: publicUrl
    };

    try {
      if (editingMeal) {
        const { error } = await supabase.from("meals").update(mealData).eq("id", editingMeal.id);
        if (error) throw error;
        toast.success("تم تحديث الوجبة بنجاح");
      } else {
        const { error } = await supabase.from("meals").insert([mealData]);
        if (error) throw error;
        toast.success("تمت إضافة الوجبة الجديدة");
      }
      
      setIsModalOpen(false);
      setMealForm({ name: "", price: "", category: "وجبات", imageName: "" });
      setEditingMeal(null);
      fetchMeals();
    } catch (error) {
      toast.error("حدث خطأ في الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الوجبة؟")) {
      await supabase.from("meals").delete().eq("id", id);
      toast.success("تم الحذف");
      fetchMeals();
    }
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    // استخراج اسم الصورة من الرابط الكامل
    const imgName = meal.image.split('/').pop() || "";
    setMealForm({
      name: meal.name,
      price: meal.price.toString(),
      category: meal.category,
      imageName: imgName
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 md:p-12 min-h-screen bg-black text-white" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black italic text-white">إدارة <span className="text-yellow-500">المنيو</span></h1>
        <button 
          onClick={() => { setEditingMeal(null); setMealForm({name:"", price:"", category:"وجبات", imageName:""}); setIsModalOpen(true); }}
          className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-all"
        >
          <Plus size={20} /> إضافة وجبة
        </button>
      </div>

      {/* عرض الوجبات في جدول أو كروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2.5rem] flex items-center gap-4 group">
            <img src={meal.image} className="w-20 h-20 rounded-2xl object-cover border border-white/5" alt="" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{meal.name}</h3>
              <p className="text-yellow-500 font-black">{meal.price} ر.ي</p>
              <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">{meal.category}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => openEditModal(meal)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit3 size={18} /></button>
              <button onClick={() => deleteMeal(meal.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* الـ Modal المطور */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[3rem] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors"><X size={28} /></button>
            <h2 className="text-2xl font-black mb-8 italic text-yellow-500 text-right">{editingMeal ? "تعديل الوجبة" : "إضافة وجبة جديدة"}</h2>
            
            <form onSubmit={handleSubmitMeal} className="space-y-5 text-right">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block mr-2 uppercase tracking-widest text-right">اسم الوجبة</label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 font-bold transition-all text-right" value={mealForm.name} onChange={e => setMealForm({...mealForm, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block mr-2 uppercase text-right">السعر</label>
                  <input required type="number" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 font-bold transition-all text-right font-sans" value={mealForm.price} onChange={e => setMealForm({...mealForm, price: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block mr-2 uppercase text-right">التصنيف</label>
                  <select 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 font-bold appearance-none cursor-pointer text-white text-right" 
                    value={mealForm.category} 
                    onChange={e => setMealForm({...mealForm, category: e.target.value})}
                  >
                    <option value="وجبات">🍱 وجبات</option>
                    <option value="بيتزا">🍕 بيتزا</option>
                    <option value="برجر">🍔 برجر</option>
                    <option value="شاورما">🌯 شاورما</option>
                    <option value="مقبلات">🍟 مقبلات</option>
                    <option value="مشروبات">🥤 مشروبات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block ml-2 uppercase text-left font-sans flex items-center gap-2">
                  <ImageIcon size={14} /> Image Name (e.g. burger.webp)
                </label>
                <input required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 font-bold text-left transition-all font-sans" placeholder="example.jpg" value={mealForm.imageName} onChange={e => setMealForm({...mealForm, imageName: e.target.value})} />
                <p className="text-[10px] text-gray-600 mt-2 mr-2 leading-relaxed italic">سيتم ربطها تلقائياً بالصور التي رفعتها في مجلد images.</p>
              </div>

              <button disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-[2rem] font-black text-xl hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/10 mt-4 active:scale-95">
                {loading ? "جاري الحفظ..." : "تأكيد الحفظ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}