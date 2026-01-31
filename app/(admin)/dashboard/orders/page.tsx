"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Timer,
  ShoppingBag,
  ChefHat,
  PackageCheck,
  RefreshCcw
} from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrders();
    };
    fetchData();

    // إعداد Realtime: تحديث القائمة فوراً عند إضافة طلب جديد
    const channel = supabase
      .channel('admin-orders-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders(); // تحديث القائمة تلقائياً عند أي تغيير
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (!error) {
      toast.success(`الحالة الآن: ${newStatus}`, {
        style: { background: '#111', color: '#fbbf24', fontWeight: 'bold' }
      });
    }
  };

  const deleteOrder = async (id: number) => {
  if (confirm("هل تريد حذف هذا الطلب نهائياً؟")) {
    // 1. الحذف من قاعدة البيانات
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete Error:", error.message);
      toast.error("فشل الحذف من قاعدة البيانات");
      return;
    }

    // 2. الحذف من الواجهة (State) فوراً لكي يختفي الطلب
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== id));
    
    toast.success("تم الحذف بنجاح");
  }
};

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `قبل ${minutes} دقيقة`;
    return `قبل ${Math.floor(minutes / 60)} ساعة`;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <RefreshCcw className="animate-spin text-yellow-500" size={40} />
    </div>
  );

  return (
    <div className="p-8 md:p-12 bg-black min-h-screen text-white font-sans" dir="rtl">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black italic">إدارة <span className="text-yellow-500">الطلبات</span></h1>
          <p className="text-gray-500 font-bold mt-2">راقب الطلبات الواردة وحدث حالتها للزبائن</p>
        </div>
        <div className="bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-2xl font-black border border-yellow-500/20">
          إجمالي الطلبات: {orders.length}
        </div>
      </div>

      <div className="grid gap-8">
        {orders.length === 0 ? (
          <div className="text-center py-32 bg-[#050505] rounded-[3rem] border border-dashed border-white/5">
            <ShoppingBag size={80} className="mx-auto mb-6 text-gray-800" />
            <p className="text-gray-600 font-black text-2xl">لا توجد طلبات في الانتظار</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] transition-all hover:border-white/10 relative overflow-hidden group">
              {/* شريط الحالة الجانبي */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors ${
                order.status === 'جاهز للاستلام' ? 'bg-green-500' : 
                order.status === 'جاري التحضير' ? 'bg-blue-500' : 'bg-yellow-500'
              }`} />

              <div className="flex flex-col xl:flex-row justify-between gap-10">
                
                {/* معلومات الطلب والوجبات */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="bg-white text-black px-5 py-2 rounded-2xl font-black text-sm tracking-widest">
                      #{order.id}
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-white/5 px-4 py-2 rounded-2xl">
                      <Timer size={16} className="text-yellow-500" /> {getTimeAgo(order.created_at)}
                    </span>
                    <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black uppercase ${
                      order.status === 'جاهز للاستلام' ? 'bg-green-500/10 text-green-500' : 
                      order.status === 'جاري التحضير' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {order.status === 'جاري التحضير' && <ChefHat size={14} className="animate-bounce" />}
                      {order.status === 'جاهز للاستلام' && <PackageCheck size={14} />}
                      {order.status === 'قيد الانتظار' && <Clock size={14} />}
                      {order.status}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 px-6 py-4 rounded-[1.5rem] border border-white/5 group-hover:bg-white/10 transition-colors">
                        <span className="font-black text-gray-200">{item.name}</span>
                        <span className="bg-yellow-500 text-black w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الحساب والأزرار الذكية */}
                <div className="flex flex-col items-center xl:items-end justify-between min-w-[280px] border-t xl:border-t-0 xl:border-r border-white/5 pt-8 xl:pt-0 xl:pr-10">
                  <div className="text-center xl:text-right mb-8">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">القيمة الإجمالية</p>
                    <p className="text-5xl font-black text-yellow-500 tracking-tighter">{order.total_price.toLocaleString()} <span className="text-lg">ر.ي</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    {/* زر جاري التحضير */}
                    <button 
                      onClick={() => updateStatus(order.id, 'جاري التحضير')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black transition-all ${
                        order.status === 'جاري التحضير' ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-500 hover:bg-blue-500/10'
                      }`}
                    >
                      <ChefHat size={18} /> تحضير
                    </button>

                    {/* زر جاهز للاستلام */}
                    <button 
                      onClick={() => updateStatus(order.id, 'جاهز للاستلام')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black transition-all ${
                        order.status === 'جاهز للاستلام' ? 'bg-green-600 text-white' : 'bg-white/5 text-green-500 hover:bg-green-500/10'
                      }`}
                    >
                      <PackageCheck size={18} /> جاهز
                    </button>

                    {/* زر الحذف */}
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="col-span-2 flex items-center justify-center gap-2 p-4 bg-red-500/5 text-red-500/40 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all mt-2"
                    >
                      <Trash2 size={16} /> أرشفة الطلب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}