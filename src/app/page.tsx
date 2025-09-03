import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden homepage-background">
      <div className="relative z-10 flex justify-center pt-8">
        <Image
          src="/logo.png"
          alt="FOOTLE Logo"
          width={250}
          height={100}
          className="w-[200px] h-auto sm:w-[250px] drop-shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
