export default function ClassicPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Classic Mode
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl">
          Guess the footballer with clues revealed after each attempt. 
          Each wrong guess gives you a new hint to help narrow down the answer!
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
