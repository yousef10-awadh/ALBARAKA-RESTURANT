

"use client";

import { useEffect, useState ,useRef} from "react";
import { supabase } from "@/lib/supabase";


import toast from "react-hot-toast";

import { 
  ShoppingBag, 
  DollarSign,
  Package,
  Plus,
  ArrowUpRight,
  Utensils
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    ordersCount: 0,
    mealsCount: 0
  });


  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. تعريف صوت التنبيه
    audioRef.current = new Audio("/bell.mp3");

    // 2. الاشتراك في التحديثات اللحظية لجدول الطلبات
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // استمع فقط للطلبات الجديدة
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          // تشغيل الصوت
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
          }
          
          // إظهار تنبيه منبثق فخم
          toast.success("🔥 طلب جديد وصل الآن!", {
            duration: 10000,
            style: {
              background: '#fbbf24',
              color: '#000',
              fontWeight: '900',
              borderRadius: '20px',
              padding: '20px'
            }
          });

          // تحديث الإحصائيات فوراً
          fetchStats();
        }
      )
      .subscribe();

    const fetchStats = async () => {
      const { data: orders } = await supabase.from("orders").select("total_price");
      const { data: meals } = await supabase.from("meals").select("id");
      if (orders && meals) {
        setStats({
          totalSales: orders.reduce((acc, curr) => acc + curr.total_price, 0),
          ordersCount: orders.length,
          mealsCount: meals.length
        });
      }
    };

    fetchStats();

    // إغلاق الاشتراك عند مغادرة الصفحة
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);



  useEffect(() => {
    const fetchStats = async () => {
      // جلب إحصائيات الطلبات والمبيعات من جدول orders
      const { data: orders } = await supabase.from("orders").select("total_price");
      // جلب إجمالي الوجبات من جدول meals
      const { data: meals } = await supabase.from("meals").select("id");

      if (orders && meals) {
        const total = orders.reduce((acc, curr) => acc + curr.total_price, 0);
        setStats({
          totalSales: total,
          ordersCount: orders.length,
          mealsCount: meals.length
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">
            لوحة <span className="text-yellow-500">الإدارة</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">نظرة عامة على أداء مطعم البركة اليوم</p>
        </div>
        <Link 
          href="/dashboard/meals/new" // تأكد من المسار حسب مجلداتك داخل (admin)
          className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/10 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> إضافة وجبة
        </Link>
      </div>
      <div className="hidden">تنبيهات الطلبات نشطة ✅</div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Sales */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <DollarSign size={24} />
            </div>
            <ArrowUpRight className="text-gray-700 group-hover:text-green-500 transition-colors" size={20} />
          </div>
          <p className="text-gray-500 font-bold mb-1">إجمالي المبيعات</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{stats.totalSales.toLocaleString()} <span className="text-sm">ر.ي</span></h3>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-gray-500 font-bold mb-1">عدد الطلبات</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{stats.ordersCount} <span className="text-sm">طلب</span></h3>
        </div>

        {/* Card 3: Menu Meals */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Utensils size={24} />
            </div>
          </div>
          <p className="text-gray-500 font-bold mb-1">وجبات المنيو</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{stats.mealsCount} <span className="text-sm">وجبة</span></h3>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/dashboard/orders" className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] hover:border-yellow-500/30 transition-all group">
          <h3 className="text-2xl font-black mb-3">الطلبات الواردة</h3>
          <p className="text-gray-500 leading-relaxed font-medium">متابعة الطلبات الجديدة وتغيير حالتها (قيد التحضير، تم التوصيل).</p>
          <div className="mt-6 text-yellow-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
            دخول الآن <ArrowUpRight size={18} />
          </div>
        </Link>

        <Link href="/dashboard/meals" className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] hover:border-blue-500/30 transition-all group">
          <h3 className="text-2xl font-black mb-3">تعديل المنيو</h3>
          <p className="text-gray-500 leading-relaxed font-medium">التحكم في الوجبات، الأسعار، الصور، وتصنيفات الطعام.</p>
          <div className="mt-6 text-blue-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
            إدارة المنيو <ArrowUpRight size={18} />
          </div>
        </Link>
      </div>
    </div>
  );
}