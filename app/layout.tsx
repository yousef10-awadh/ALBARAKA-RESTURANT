import { type Metadata } from 'next'

import { Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

// إعداد خط "تجوال" ليكون الخط الرئيسي والوحيد
const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  weight: ["400", "500", "700", "800", "900"],
  display: 'swap', 
});

export const metadata: Metadata = {
  title: "مطعم البركة | أفضل المأكولات التقليدية في عدن",
  description: "استمتع بأشهى المأكولات الشعبية، بيتزا، برجر، وشاورما في قلب عدن - شارع التسعين. طلبات أونلاين وتوصيل سريع.",
  keywords: ["مطعم البركة عدن", "أكل عدني", "منيو مطعم البركة", "توصيل أكل عدن", "أفضل مطعم في التسعين"],
  openGraph: {
    title: "مطعم البركة - عدن",
    description: "أطلب وجبتك المفضلة الآن من منيو البركة المتنوع.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // قمنا بتغيير اللغة إلى ar والاتجاه إلى rtl
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={tajawal.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // بما أن تصميم مطعمنا أسود، الأفضل يكون dark افتراضياً
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {children}
            <Toaster position="bottom-center" reverseOrder={false} />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}