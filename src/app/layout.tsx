import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/FootleDialog";
import { FootleDialogContent } from "@/components/FootleDialog";
import { ContactForm } from "@/components/ContactForm";
import EmergencyReset from "@/components/EmergencyReset";
import "./globals.css";
import { DailyProvider } from "@/components/DailyProvider";
import background from "../../public/background.png";

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
      <head>
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-FZBZKR1GT1"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FZBZKR1GT1');
          `,
        }}
      />
      <link rel="preconnect" href="https://cdn.footle.xyz" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdn.footle.xyz" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2177203441703111"
              crossOrigin="anonymous"></script>
      </head>
      <body>
        <div className="fixed inset-0 -z-10 pointer-events-none select-none">
          <Image
            src={background}
            alt="Football themed background"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>
        <div className="min-h-screen relative overflow-hidden">
          {/* Header */}
          <header className="relative z-10 mb-6 flex items-start justify-center pt-6 sm:pt-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="FOOTLE Logo"
                width={280}
                height={120}
                className="w-[200px] h-auto sm:w-[260px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)] transition-transform hover:scale-105"
                priority
                sizes="(max-width: 640px) 200px, 260px"
              />
            </Link>
          </header>

          {/* Main Content */}
          <DailyProvider>
            <main className="relative z-10">
              {children}
            </main>
          </DailyProvider>

          {/* Footer */}
          <footer className="relative z-10 mt-8 sm:mt-12 mb-4 flex flex-col items-center text-center text-white/90">
            <div className="flex gap-3 mb-2">
              <Link
                href="https://ko-fi.com/footle"
                target="_blank"
                className="transition-transform hover:scale-110 mb-4"
              >
                <Image src="/kofi.png" alt="Ko-fi" width={128} height={128} sizes="128px" />
              </Link>
              <EmergencyReset />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <span>footle.xyz .... {new Date().getFullYear()}</span>

              {/* Contact Dialog */}
              <Dialog>
                <DialogTrigger className="transition-transform hover:scale-105 underline/20">
                  Contact
                </DialogTrigger>
                <FootleDialogContent title="Contact">
                  <ContactForm />
                </FootleDialogContent>
              </Dialog>

              <Link href="/privacy" className="transition-transform hover:scale-105">Privacy Policy</Link>

              {/* About Dialog */}
              <Dialog>
                <DialogTrigger className="transition-transform hover:scale-105 underline/20">
                  About
                </DialogTrigger>
                <FootleDialogContent title="About Footle">
                  <div className="space-y-4 text-left">
                    <p className="text-white/90">
                      Guess a different footballer every day!
                    </p>
                    <p className="text-white/80">
                      This content is not affiliated with endorsed sponsored or specifically approved by Electronic Arts and EA is not responsible for it. For more information see EA's
                      {" "}
                      <a
                        href="https://help.ea.com/en/articles/security-and-rules/ea-content-policy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f0d36c] underline/30"
                      >
                        Content Policy
                      </a>
                      .
                    </p>
                    <p className="text-white/80">
                      Footle is greatly inspired by Wordle and
                      {" "}
                      <a
                        href="https://loldle.net/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f0d36c] underline/30"
                      >
                        Loldle
                      </a>
                      .
                    </p>
                  </div>
                </FootleDialogContent>
              </Dialog>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}