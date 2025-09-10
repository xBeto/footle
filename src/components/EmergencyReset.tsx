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
      className="ml-2 h-16 items-center px-3 py-2 rounded-md bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-500 active:scale-[0.98] transition"
      aria-label="Emergency reset"
    >
      Emergency Reset
    </button>
  );
}


