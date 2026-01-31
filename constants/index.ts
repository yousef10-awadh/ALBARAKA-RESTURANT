// src/constants/index.ts
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  Settings, 
  
} from "lucide-react";


export const SITE_CONFIG = {
  name: "Al-Baraka Restaurant",
  currency: "YER",
  contactEmail: "info@albaraka.com"
};

export const MENU_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "burgers", name: "Burgers" },
  { id: "pizza", name: "Pizza" },
  { id: "drinks", name: "Drinks" }
];

export const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/" },
  { name: "Meals", icon: UtensilsCrossed, href: "/meals" },
  { name: "Orders", icon: ClipboardList, href: "/orders" },
  { name: "Settings", icon: Settings, href: "/settings" },
];


export const orders = [
  { id: "#8801", customer: "Ahmed Ali", total: "$54.00", status: "Pending", items: 3 },
  { id: "#8802", customer: "Sara J.", total: "$120.00", status: "Preparing", items: 5 },
  { id: "#8803", customer: "John Doe", total: "$22.50", status: "Completed", items: 1 },
];




 // src/types.ts أو الملف الموجود فيه البيانات
