"use client";

export default function EmergencyReset() {
  function handleClick() {
    const ok = window.confirm(
      "If you encounter any visual or data bugs, press Ok to reset all data and reload the page."
    );
    if (!ok) return;
    try {
      localStorage.clear();
      sessionStorage.clear?.();
    } catch {}
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-32 h-[67.8px] items-center px-3 py-2 rounded-md bg-red-600 text-white text-sm font-semibold shadow transition-transform hover:scale-110"
      aria-label="Emergency reset"
    >
      Emergency Reset
    </button>
  );
}


