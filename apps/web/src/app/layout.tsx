import type { Metadata } from "next";

import { Roboto } from "next/font/google";

import "../index.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SolarFlow",
  description: "CRM built for Solar Businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <main className="flex min-h-screen justify-center">
          <div className="flex min-h-screen w-full flex-col items-center justify-start">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
