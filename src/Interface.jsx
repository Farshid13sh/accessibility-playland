export function Interface({ activeImpairment, isFixed, onCheckCode }) {
  if (!activeImpairment) return null;

  return (
    <div className="absolute top-10 right-10 w-80 bg-slate-900/90 p-8 rounded-2xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-50">
      <h2 className="text-yellow-400 font-bold text-xl uppercase italic mb-4">Park Scenario</h2>
      <p className="text-xs opacity-80 leading-relaxed mb-4">
        The outdoor glare is washing out the Information Sign. Low-contrast screens are a major accessibility barrier.
      </p>
      
      <div className="bg-black p-4 rounded-lg font-mono text-[11px] border border-white/5">
        <span className="text-blue-400">#vision-config</span> {'{'} <br/>
        <div className="pl-4 py-2">
          brightness: <input 
            type="text" 
            className="bg-slate-800 w-20 text-center rounded border border-white/20 mx-1 outline-none text-yellow-400 py-1"
            placeholder="..." 
            autoFocus
            onChange={(e) => onCheckCode(e.target.value)}
          />;
        </div>
        {'}'}
      </div>
      <p className="text-[9px] mt-3 opacity-30 italic text-center text-white">Hint: set to 1</p>

      {isFixed && (
        <div className="mt-6 bg-emerald-500 py-3 rounded-xl text-center text-xs font-bold text-black uppercase">
           ✓ Simulation Repaired
        </div>
      )}
    </div>
  )
}