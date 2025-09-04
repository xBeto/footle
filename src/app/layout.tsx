import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const myFont = localFont({
  src: '../../public/fonts/fifafont.otf',
})

export const metadata: Metadata = {
  title: "Footle",
  description: "Guess the daily Footballer with clues revealed after each try!",
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