// import Link from "next/link";
// import { Home } from "lucide-react";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-[#050505] overflow-x-hidden" dir="rtl">
//       <div className="flex-1 flex flex-col">
//         {/* الهيدر الجديد مع زر العودة للرئيسية */}
//         <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
//           <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
//             نظام إدارة مطعم البركة <span className="text-yellow-500">v1.0</span>
//           </div>
          
//           <Link 
//             href="/" 
//             className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-yellow-500 transition-colors bg-white/5 px-4 py-2 rounded-lg"
//           >
//             <Home size={14} />
//             العودة للموقع الرئيسي
//           </Link>
//         </header>

//         <main className="flex-1">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  LogOut, 
  ChevronLeft,
  Home,
  Ticket
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "الرئيسية", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "إدارة الطلبات", path: "/dashboard/orders", icon: <ShoppingBag size={20} /> },
    { name: "إدارة المنيو", path: "/dashboard/meals", icon: <Utensils size={20} /> },
    { name: "الكوبونات", path: "/dashboard/coupons", icon: <Ticket size={20} /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 border-l border-white/5 bg-[#050505] flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-xl">B</div>
            <span className="text-2xl font-black italic">البركة<span className="text-yellow-500">.</span></span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
                    isActive 
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10" 
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </div>
                  {isActive && <ChevronLeft size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <Link href="/" className="flex items-center gap-3 text-gray-500 hover:text-white font-bold transition-colors p-2">
            <Home size={20} /> عرض الموقع
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 w-full p-4 rounded-2xl font-bold transition-all"
          >
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}