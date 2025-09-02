import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const myFont = localFont({
  src: '../../public/fonts/fifa.ttf',
})

export const metadata: Metadata = {
  title: "FOOTLE",
  description: "FOOTLE - Your football experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={myFont.className}>
      <body>
        {children}
      </body>
    </html>
  );
}