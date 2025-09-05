export default function PixelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Pixel Mode
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl">
          Can you identify the footballer from a pixelated image? 
          The image becomes clearer with each wrong guess!
        </p>
        <div className="bg-[#111e29] border-[3px] border-[#f0d36c] rounded-lg p-6 max-w-md mx-auto">
          <p className="text-white/90 text-sm">
            🚧 Coming Soon! This mode is currently under development.
          </p>
        </div>
      </div>
    </div>
  );
}
