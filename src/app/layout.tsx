import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stéra | Coffee & Tea Bar",
  description: "Dari sudut kecil, untuk hari yang besar. Premium coffee and tea bar serving the finest beverages crafted with love.",
  keywords: ["coffee", "tea", "cafe", "stera", "coffee bar", "tea bar", "yogyakarta"],
  authors: [{ name: "Stéra Coffee & Tea Bar" }],
  openGraph: {
    title: "Stéra | Coffee & Tea Bar",
    description: "Dari sudut kecil, untuk hari yang besar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
