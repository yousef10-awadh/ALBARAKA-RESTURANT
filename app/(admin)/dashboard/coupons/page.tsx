"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Ticket, Power, PowerOff, X } from "lucide-react";
import toast from "react-hot-toast";

interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    code: "",
    discount_percent: ""
  });

  const fetchCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*").order("id", { ascending: false });
    if (data) setCoupons(data);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("coupons").insert([
        { 
          code: form.code.toUpperCase(), 
          discount_percent: parseInt(form.discount_percent),
          is_active: true 
        }
      ]);

      if (error) throw error;

      toast.success("تم إضافة الكوبون بنجاح");
      setIsModalOpen(false);
      setForm({ code: "", discount_percent: "" });
      fetchCoupons();
    } catch (error) {
      toast.error("الكود موجود مسبقاً أو هناك خطأ");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    await supabase.from("coupons").update({ is_active: !currentStatus }).eq("id", id);
    toast.success("تم تحديث حالة الكوبون");
    fetchCoupons();
  };

  const deleteCoupon = async (id: number) => {
    if (confirm("هل تريد حذف هذا الكوبون نهائياً؟")) {
      await supabase.from("coupons").delete().eq("id", id);
      toast.success("تم الحذف");
      fetchCoupons();
    }
  };

  return (
    <div className="p-8 md:p-12 min-h-screen bg-black text-white font-sans" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black italic">إدارة <span className="text-yellow-500">الكوبونات</span></h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg"
        >
          <Plus size={20} /> إضافة كود خصم
        </button>
      </div>

      <div className="grid gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className={`bg-[#0a0a0a] border ${coupon.is_active ? 'border-white/5' : 'border-red-500/20 opacity-60'} p-6 rounded-[2rem] flex items-center justify-between transition-all`}>
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${coupon.is_active ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'}`}>
                <Ticket size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-widest">{coupon.code}</h3>
                <p className="text-gray-500 font-bold">خصم بنسبة <span className="text-white">{coupon.discount_percent}%</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                className={`p-3 rounded-xl transition-all ${coupon.is_active ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                title={coupon.is_active ? "تعطيل" : "تفعيل"}
              >
                {coupon.is_active ? <Power size={22} /> : <PowerOff size={22} />}
              </button>
              <button 
                onClick={() => deleteCoupon(coupon.id)}
                className="p-3 bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal إضافة كوبون جديد */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors"><X size={28} /></button>
            <h2 className="text-2xl font-black mb-8 italic text-yellow-500 text-right">إضافة كود خصم جديد</h2>
            
            <form onSubmit={handleAddCoupon} className="space-y-6 text-right">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block mr-2 uppercase tracking-widest">الكود (مثلاً: ADEN2024)</label>
                <input 
                  required 
                  className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 font-black text-center tracking-widest uppercase"
                  value={form.code}
                  onChange={e => setForm({...form, code: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block mr-2 uppercase tracking-widest">نسبة الخصم (%)</label>
                <input 
                  required 
                  type="number" 
                  max="100"
                  className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 font-black text-center"
                  value={form.discount_percent}
                  onChange={e => setForm({...form, discount_percent: e.target.value})}
                />
              </div>

              <button disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-[2rem] font-black text-xl hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/10 mt-4">
                {loading ? "جاري الحفظ..." : "تفعيل الكود الآن"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}