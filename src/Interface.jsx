export const impairmentData = {
  motor: {
    title: "ATM Station",
    desc: "Simulating hand tremors (Parkinson's). Interaction requires precision that many lack.",
    why: "Public kiosks often fail Fitts's Law—targets are too small for motor-impaired users.",
    fixHint: "jitter: 0",
    solution: "0"
  },
  sunshine: {
    title: "Park Bench",
    desc: "Outdoor glare washes out screen contrast.",
    why: "Content must be readable in 100,000 lux sunlight, not just in a dark office.",
    fixHint: "brightness: 1",
    solution: "1"
  },
  tunnel: {
    title: "Bus Station",
    desc: "Peripheral vision loss (Glaucoma). Only the center is visible.",
    why: "Corner-based UI elements are effectively invisible to these users.",
    fixHint: "align: center",
    solution: "center"
  },
  blur: {
    title: "Medical Clinic",
    desc: "Refractive errors. Everything is out of focus.",
    why: "Thin fonts and low contrast are the first barriers for aging populations.",
    fixHint: "blur-px: 0",
    solution: "0"
  },
  colorblind: {
    title: "Subway Map",
    desc: "Color vision deficiency. Lines are indistinguishable.",
    why: "8% of men cannot distinguish between red and green lines.",
    fixHint: "saturation: 100",
    solution: "100"
  }
}

export function Interface({ activeImpairment, isFixed, onCheckCode }) {
  if (!activeImpairment) return null;
  const data = impairmentData[activeImpairment];

  return (
    <div className="absolute top-10 right-10 w-80 bg-slate-900/90 p-8 rounded-2xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-50 animate-in slide-in-from-right duration-500">
      <h2 className="text-yellow-400 font-bold text-xl uppercase italic mb-4 underline underline-offset-8 decoration-yellow-400/20">{data.title}</h2>
      <p className="text-xs opacity-80 leading-relaxed mb-4">{data.desc}</p>
      <p className="text-[10px] text-red-400 font-bold mb-6 tracking-widest uppercase italic">Impact: {data.why}</p>
      
      <div className="bg-black p-4 rounded-lg font-mono text-[11px] border border-white/5">
        <span className="text-blue-400">#fix-config</span> {'{'} <br/>
        <div className="pl-4 py-2">
          {activeImpairment}: <input 
            type="text" 
            className="bg-slate-800 w-20 text-center rounded border border-white/20 mx-1 outline-none text-yellow-400 py-1"
            placeholder="..." 
            autoFocus
            onChange={(e) => onCheckCode(e.target.value)}
          />;
        </div>
        {'}'}
      </div>
      <p className="text-[9px] mt-3 opacity-30 italic text-center">Hint: {data.fixHint}</p>

      {isFixed && (
        <div className="mt-6 bg-emerald-500 py-3 rounded-xl text-center text-xs font-bold text-black uppercase animate-pulse">
           ✓ Simulation Repaired
        </div>
      )}
    </div>
  )
}