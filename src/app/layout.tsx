import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Accounting Pro | نظام المحاسبة الاحترافي",
  description: "نظام محاسبة احترافي باللغة العربية - Professional Arabic Accounting System",
  keywords: ["محاسبة", "accounting", "عربي", "Arabic", "فواتير", "invoices", "مخزون", "inventory"],
  authors: [{ name: "Accounting Pro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Accounting Pro - نظام المحاسبة الاحترافي",
    description: "نظام محاسبة احترافي متكامل باللغة العربية",
    siteName: "Accounting Pro",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
