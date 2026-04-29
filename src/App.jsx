import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import { Player } from './Player'
import './index.css'

const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

const impairmentData = {
  sunshine: {
    title: "High Contrast / Glare",
    description: "Reflections and high brightness can wash out content. This is common for users with photophobia or those using devices in direct sunlight.",
    why: "Without proper contrast ratios, your site becomes a blank white wall to many users.",
    fixHint: "Try setting brightness to: 1"
  },
  colorblind: {
    title: "Color Blindness",
    description: "Simulating Monochromacy. When color is the only way to distinguish information, these users are left behind.",
    why: "Information must be accessible through text, patterns, or icons—not just hue.",
    fixHint: "Try setting saturation to: 100"
  },
  blur: {
    title: "Refractive Errors",
    description: "Simulates blurry vision. This mimics what millions of users see without corrective lenses or due to aging.",
    why: "Small fonts and low-contrast details are the first things lost in a blurry interface.",
    fixHint: "Try setting blur-px to: 0"
  },
  tunnel: {
    title: "Tunnel Vision",
    description: "Peripheral vision loss limits the field of view to a small central circle.",
    why: "Critical UI elements (like 'Next' buttons) shouldn't be hidden in the far corners.",
    fixHint: "Type: center"
  },
  motor: {
    title: "Motor Tremors",
    description: "Hand tremors make precise mouse movements difficult or impossible.",
    why: "Large hit targets and 'friction-less' navigation are essential for motor-impaired users.",
    fixHint: "Try setting jitter to: 0"
  }
}

export default function App() {
  const [activeImpairment, setActiveImpairment] = useState(null)
  const [isFixed, setIsFixed] = useState(false)

  const handleZoneChange = (zone) => {
    if (zone !== activeImpairment) {
      setActiveImpairment(zone)
      setIsFixed(false) 
    }
  }

  const checkCode = (input, type) => {
    const solutions = { sunshine: "1", colorblind: "100", blur: "0", tunnel: "center", motor: "0" }
    if (input.toLowerCase() === solutions[type]) setIsFixed(true)
  }

  return (
    <KeyboardControls map={map}>
      {/* MAIN CONTAINER (Clean Background) */}
      <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans">
        
        {/* --- LAYER 1: THE SIMULATION ENGINE (This gets the filters) --- */}
        <div className={`absolute inset-0 transition-all duration-700
          ${activeImpairment === 'sunshine' && !isFixed ? 'filter-sunshine' : ''}
          ${activeImpairment === 'colorblind' && !isFixed ? 'filter-grayscale' : ''}
          ${activeImpairment === 'blur' && !isFixed ? 'filter-blur' : ''}
          ${activeImpairment === 'motor' && !isFixed ? 'animate-shake' : ''}
        `}>
          <Canvas camera={{ position: [15, 15, 15], fov: 40 }}>
            <ambientLight intensity={1.5} />
            <Player onZoneEnter={handleZoneChange} activeImpairment={activeImpairment} isFixed={isFixed} />
            
            {/* Zone Markers */}
            <Zone position={[10, 0, 10]} color="#808080" /> {/* Colorblind */}
            <Zone position={[10, 0, -10]} color="#3b82f6" /> {/* Tunnel */}
            <Zone position={[-10, 0, -10]} color="#a855f7" /> {/* Blur */}
            <Zone position={[-10, 0, 10]} color="#eab308" /> {/* Sunshine */}
            <Zone position={[0, 0, 0]} color="#22c55e" /> {/* Motor */}
            
            <gridHelper args={[40, 40, 0x444444, 0x222222]} />
            <OrbitControls makeDefault enablePan={false} />
          </Canvas>

          {/* Tunnel Vision Overlay (Inside the filtered layer) */}
          {activeImpairment === 'tunnel' && !isFixed && (
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(circle at center, transparent 15%, black 80%)' }} />
          )}
        </div>

        {/* --- LAYER 2: THE SIDEBAR (ALWAYS CLEAR) --- */}
        <div className="absolute top-0 left-0 h-full w-64 bg-blue-800 z-40 p-6 text-white border-r border-white/10 shadow-2xl flex flex-col">
          <h2 className="text-2xl font-bold tracking-tighter italic mb-1">ACCESSIBILITY</h2>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest mb-8">Test Lab v2.0</p>
          
          <div className="space-y-4 flex-grow">
            {Object.keys(impairmentData).map((mode) => (
              <div key={mode} className={`flex items-center space-x-3 p-2 rounded transition-colors ${activeImpairment === mode ? 'bg-white/10' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${activeImpairment === mode ? 'bg-yellow-400' : 'bg-white/20'}`} />
                <p className={`text-[11px] uppercase tracking-widest ${activeImpairment === mode ? 'text-yellow-400 font-bold' : 'opacity-40'}`}>
                  {mode}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-6 border-t border-white/10 text-[10px] opacity-50">
             BCIT NEW MEDIA DESIGN<br/>
             FARSHID SHAKERI
          </div>
        </div>

        {/* --- LAYER 3: THE LESSON PANEL (ALWAYS CLEAR) --- */}
        {activeImpairment && (
          <div className="absolute top-6 right-6 bottom-6 w-96 bg-slate-900/95 z-50 p-8 text-white border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl font-black text-yellow-400 uppercase tracking-tight">
                Fixing: {activeImpairment}
              </h2>
              <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono">0x{activeImpairment.length}A</span>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              <section>
                <h3 className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2 italic">The Challenge</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">{impairmentData[activeImpairment].description}</p>
              </section>

              <section>
                <h3 className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-2 italic">Design Impact</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">{impairmentData[activeImpairment].why}</p>
              </section>

              {/* CODE EDITOR BOX */}
              <div className="mt-8 bg-black p-5 rounded-xl font-mono text-xs border border-white/10 shadow-inner">
                 <div className="flex space-x-1.5 mb-3 opacity-30">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 </div>
                 <span className="text-blue-400">/* fix-config.css */</span><br/>
                 <span className="text-purple-400">.viewport</span> {'{'} <br/>
                 <div className="pl-4 py-3">
                    <span className="text-slate-400">
                      {activeImpairment === 'sunshine' ? 'brightness' : 
                       activeImpairment === 'colorblind' ? 'saturation' :
                       activeImpairment === 'blur' ? 'blur-px' :
                       activeImpairment === 'tunnel' ? 'align-items' : 'jitter'}: 
                    </span>
                    <input 
                      type="text" 
                      className="bg-slate-800 w-24 text-center rounded border border-white/20 mx-2 text-yellow-400 focus:border-yellow-400 outline-none transition-all py-0.5" 
                      placeholder="..."
                      autoFocus
                      onChange={(e) => checkCode(e.target.value, activeImpairment)}
                    />;
                 </div>
                 {'}'}
              </div>
              <p className="text-[10px] mt-2 text-white/30 italic text-center">{impairmentData[activeImpairment].fixHint}</p>
            </div>

            {isFixed && (
              <div className="mt-6 p-4 bg-emerald-500 text-slate-950 rounded-xl text-center font-black uppercase tracking-tighter text-sm">
                 ✓ Simulation Repaired
              </div>
            )}
          </div>
        )}
      </div>
    </KeyboardControls>
  )
}

function Zone({ position, color }) {
  return (
    <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial color={color} transparent opacity={0.3} />
    </mesh>
  )
}