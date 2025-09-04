import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/FootleDialog";
import { FootleDialogContent } from "@/components/FootleDialog";
import { ContactForm } from "@/components/ContactForm";

type Mode = {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
  disabled?: boolean;
};

const MODES: Mode[] = [
  {
    href: "/classic",
    title: "Classic",
    subtitle: "Guess the footballer, get a clue each try",
    icon: "/Classic.png",
  },
  {
    href: "/pixel",
    title: "Pixel",
    subtitle: "Guess the footballer from a pixelated image",
    icon: "/Pixel.png",
  },
  {
    href: "/silhouette",
    title: "Silhouette",
    subtitle: "Guess the footballer by their silhouette",
    icon: "/Silhouette.png",
  },
  {
    href: "/multiplayer",
    title: "Multiplayer",
    subtitle: "Play with friends and see who guesses first",
    icon: "/Multiplayer.png",
    disabled: true,
  },
];

function ModeBanner({ mode }: { mode: Mode }) {
  if (mode.disabled) {
    return (
      <div className="w-[95%] max-w-[28rem]">
        <div
          aria-disabled
          className="relative w-full cursor-not-allowed opacity-85 grayscale-[15%]"
        >
          <Image
            src={mode.icon}
            alt={mode.title}
            width={1600}
            height={400}
            className="w-full h-auto select-none"
            priority={mode.title === "Classic"}
          />

          {/* Lock icon in top-right */}
          <div className="absolute right-[15px] top-[15%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
              fill="#f0d36c"
            >
              <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm3 8H9V7a3 3 0 116 0v3z" />
            </svg>
          </div>

          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
            style={{ top: 0, left: "20%", width: "75.68%", height: "100%" }}
          >
            <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-[clamp(1rem,4vw,1.25rem)] font-semibold leading-none">
              {mode.title}
            </div>
            <div className="mt-1 text-[#e6e6e6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-[clamp(0.7rem,3vw,0.9rem)] leading-tight">
              {mode.subtitle}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={mode.href}
      className="block w-[95%] max-w-[28rem] transition-transform duration-200 hover:-translate-y-1.5 hover:scale-105"
    >
      <div className="relative w-full">
        <Image
          src={mode.icon}
          alt={mode.title}
          width={1600}
          height={400}
          className="w-full h-auto select-none"
          priority={mode.title === "Classic"}
        />

        <div
          className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
          style={{ top: 0, left: "20%", width: "75.68%", height: "100%" }}
        >
          <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-[clamp(1rem,4vw,1.25rem)] font-semibold leading-none">
            {mode.title}
          </div>
          <div className="mt-1 text-[#e6e6e6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-[clamp(0.7rem,3vw,0.9rem)] leading-tight">
            {mode.subtitle}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden homepage-background">
      {/* Header */}
      <header className="relative z-10 flex items-start justify-center pt-6 sm:pt-8">
        <Image
          src="/logo.png"
          alt="FOOTLE Logo"
          width={280}
          height={120}
          className="w-[200px] h-auto sm:w-[260px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)]"
          priority
        />
      </header>

      {/* Modes */}
      <main className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 mt-10">
        {MODES.map((m) => (
          <ModeBanner key={m.title} mode={m} />
        ))}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 sm:mt-12 mb-4 flex flex-col items-center text-center text-white/90">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="https://ko-fi.com/footle"
            target="_blank"
            className="transition-transform hover:scale-110 mb-4"
          >
            <Image src="/kofi.png" alt="Ko-fi" width={128} height={128} />
          </Link>
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
  );
}
