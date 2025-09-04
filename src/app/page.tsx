import Image from "next/image";
import Link from "next/link";

type Mode = {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
};

const MODES: Mode[] = [
  {
    href: "/classic",
    title: "Classic",
    subtitle: "Guess the player, get a clue each try",
    icon: "/Classic.png",
  },
  {
    href: "/pixel",
    title: "Pixel",
    subtitle: "Guess the player from a pixelated image",
    icon: "/Pixel.png",
  },
  {
    href: "/silhouette",
    title: "Silhouette",
    subtitle: "Guess the player by their silhouette",
    icon: "/Silhouette.png",
  },
  {
    href: "/multiplayer",
    title: "Multiplayer",
    subtitle: "Play with friends and see who guesses first",
    icon: "/Multiplayer.png",
  },
];

function ModeBanner({ mode }: { mode: Mode }) {
  return (
    <Link
      href={mode.href}
      className="block w-[95%] max-w-[28rem] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative w-full">
        {/* Full banner image (already includes frame/emblem) */}
        <Image
          src={mode.icon}
          alt={mode.title}
          width={1600}
          height={400}
          className="w-full h-auto select-none"
          priority={mode.title === "Classic"}
        />

        {/* Overlay text positioned like the original layout */}
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
            className="transition-transform hover:scale-105 mb-4"
          >
            <Image src="/kofi.png" alt="Ko-fi" width={128} height={128} />
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span>footle.xyz .... {new Date().getFullYear()}</span>
          <button className="transition-transform hover:scale-105">Contact</button>
          <Link href="/privacy" className="transition-transform hover:scale-105">Privacy Policy</Link>
          <button className="transition-transform hover:scale-105">About</button>
        </div>
      </footer>
    </div>
  );
}
