"use client";

type SuccessProps = {
  attempts: number;
  onShare?: () => void;
};

export default function Success({ attempts, onShare }: SuccessProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="rounded-lg border border-emerald-500 bg-emerald-600/20 text-white px-4 py-4 text-center">
        <div className="text-xl font-semibold">You got it!</div>
        <div className="text-white/90 mt-1">
          Solved in {attempts} {attempts === 1 ? "try" : "tries"}.
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onShare}
            className="px-3 py-2 rounded-md bg-[#f0d36c] text-black font-medium"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}