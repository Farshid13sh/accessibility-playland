import { useState, useCallback } from "react";

const MODES = [
  {
    id: "color-blindness",
    label: "Color Blindness",
  },
  {
    id: "tunnel-vision",
    label: "Tunnel Vision",
  },
  {
    id: "far-sightedness",
    label: "Far-Sightedness",
  },
  {
    id: "sunshine",
    label: "Sunshine",
  },
  {
    id: "concentration",
    label: "Concentration",
  },
];

function InfoIcon({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Information about ${label}`}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-400 text-slate-400 hover:border-slate-50 hover:text-slate-50 focus:outline-4 focus:outline-offset-2 focus:outline-blue-400 transition-colors flex-shrink-0"
      title={`Learn more about ${label}`}
    >
      <span className="text-xs font-bold leading-none">i</span>
    </button>
  );
}

function Toggle({ active, onChange, label }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={active}
      aria-label={`Toggle ${label}`}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-4 focus:outline-offset-2 focus:outline-blue-400 flex-shrink-0 ${
        active ? "bg-blue-500" : "bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
          active ? "translate-x-7" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function Interface({
  activeImpairment,
  isFixed,
  onCheckCode,
  modes = MODES,
  activeMode,
  onToggle,
  onReset,
  onInfo,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-80 bg-slate-950 border-r-2 border-slate-800 flex-col p-6 overflow-y-auto z-40"
        aria-label="Accessibility controls"
      >
        <h2 className="text-xl font-bold text-slate-50 mb-8 tracking-wide">
          Accessibility Modes
        </h2>

        <nav className="flex flex-col gap-0 flex-1 mb-6">
          <ul className="space-y-3">
            {modes.map((mode) => (
              <li key={mode.id}>
                <div
                  className={`flex items-center justify-between min-h-14 px-4 py-3 rounded-lg transition-colors ${
                    activeMode === mode.id
                      ? "bg-slate-800"
                      : "hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-slate-50 font-medium truncate">
                      {mode.label}
                    </span>
                    <InfoIcon
                      onClick={() => onInfo?.(mode.id)}
                      label={mode.label}
                    />
                  </div>
                  <Toggle
                    active={activeMode === mode.id}
                    onChange={() => onToggle?.(mode.id)}
                    label={mode.label}
                  />
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Reset Button */}
        <button
          onClick={onReset}
          aria-label="Reset all accessibility modes to default"
          className="w-full py-3 px-4 bg-transparent border-2 border-red-600 text-red-500 font-bold rounded-lg hover:bg-red-600 hover:text-white focus:outline-4 focus:outline-offset-2 focus:outline-red-500 transition-colors text-sm"
        >
          Reset All
        </button>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400 text-center">
          <p className="leading-relaxed">
            Follow{" "}
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline focus:outline-2 focus:outline-offset-1 focus:outline-blue-400"
            >
              WCAG 2.1 AA
            </a>{" "}
            guidelines
          </p>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-slate-950 border-b-2 border-slate-800 sticky top-0 z-30">
        {/* Toggle Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close accessibility menu" : "Open accessibility menu"}
          aria-expanded={mobileMenuOpen}
          className="w-full px-4 py-4 flex items-center justify-between bg-slate-900 hover:bg-slate-800 focus:outline-4 focus:outline-offset-0 focus:outline-blue-400 transition-colors"
        >
          <span className="font-bold text-slate-50 text-sm">
            Accessibility Modes
          </span>
          <svg
            className={`w-5 h-5 text-slate-50 transition-transform ${
              mobileMenuOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {/* Mobile Menu Items */}
        {mobileMenuOpen && (
          <nav
            className="bg-slate-900 border-t border-slate-800 max-h-96 overflow-y-auto"
            aria-label="Accessibility controls"
          >
            <ul className="divide-y divide-slate-800">
              {modes.map((mode) => (
                <li key={mode.id}>
                  <div className="flex items-center justify-between min-h-14 px-4 py-3 hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-slate-50 font-medium truncate text-sm">
                        {mode.label}
                      </span>
                      <InfoIcon
                        onClick={() => onInfo?.(mode.id)}
                        label={mode.label}
                      />
                    </div>
                    <Toggle
                      active={activeMode === mode.id}
                      onChange={() => onToggle?.(mode.id)}
                      label={mode.label}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                onReset?.();
                setMobileMenuOpen(false);
              }}
              aria-label="Reset all accessibility modes"
              className="w-full py-3 px-4 m-4 mt-2 bg-transparent border-2 border-red-600 text-red-500 font-bold rounded-lg hover:bg-red-600 hover:text-white focus:outline-4 focus:outline-offset-2 focus:outline-red-500 transition-colors text-sm"
            >
              Reset All
            </button>
          </nav>
        )}
      </div>

      {/* 3D Experience Overlay (when in park scenario) */}
      {activeImpairment && (
        <div className="absolute top-10 right-10 w-80 bg-slate-900/90 p-8 rounded-2xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-50">
          <h2 className="text-yellow-400 font-bold text-xl uppercase italic mb-4">
            Park Scenario
          </h2>
          <p className="text-xs opacity-80 leading-relaxed mb-4">
            The outdoor glare is washing out the Information Sign. Low-contrast screens are a major accessibility barrier.
          </p>

          <div className="bg-black p-4 rounded-lg font-mono text-[11px] border border-white/5">
            <span className="text-blue-400">#vision-config</span> {'{'} <br />
            <div className="pl-4 py-2">
              brightness:{" "}
              <input
                type="text"
                aria-label="Brightness configuration input"
                className="bg-slate-800 w-20 text-center rounded border border-white/20 mx-1 outline-none text-yellow-400 py-1 focus:outline-2 focus:outline-yellow-400"
                placeholder="..."
                autoFocus
                onChange={(e) => onCheckCode(e.target.value)}
              />
              ;
            </div>
            {"}"}
          </div>
          <p className="text-[9px] mt-3 opacity-30 italic text-center text-white">
            Hint: set to 1
          </p>

          {isFixed && (
            <div className="mt-6 bg-emerald-500 py-3 rounded-xl text-center text-xs font-bold text-black uppercase">
              ✓ Simulation Repaired
            </div>
          )}
        </div>
      )}
    </>
  );
}
