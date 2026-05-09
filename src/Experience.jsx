import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { Player } from './Player'
import { Environment } from './Environment'

const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

export default function Experience() {
  const [activeImpairment, setActiveImpairment] = useState(null)
  const [fixLevel, setFixLevel] = useState(0) // This state must sync with the slider

  // Calculate dynamic filters for the scene
  const brightness = activeImpairment === 'sunshine' ? 1.8 - (0.8 * (fixLevel / 100)) : 1
  const contrast = activeImpairment === 'sunshine' ? 0.4 + (0.6 * (fixLevel / 100)) : 1
  const saturation = activeImpairment === 'concentration' ? 1.6 - (0.6 * (fixLevel / 100)) : 1
  const isFixed = fixLevel > 95

  const handleZoneChange = (zone) => {
    if (zone !== activeImpairment) {
      setActiveImpairment(zone)
      setFixLevel(0) 
    }
  }

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        
        {/* FIX 1: RESTORED BACK TO HOME LINK */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full z-100 backdrop-blur-md border border-white/10 transition-all"
        >
          ← Back to Home
        </Link>

        {/* 3D World with Dynamic Scene Filters */}
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{ filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})` }}
        >
          <Canvas shadows camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <Player onZoneEnter={handleZoneChange} />
              <Environment 
                activeImpairment={activeImpairment} 
                isFixed={isFixed} 
                fixLevel={fixLevel} 
              />
            </Suspense>
            <PointerLockControls />
          </Canvas>
        </div>

        {/* FIX 2: REPAIRED CODEFIX PANEL & SLIDER */}
        {activeImpairment && (
          <div className="absolute top-10 right-10 w-80 bg-slate-900/90 p-8 rounded-3xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-100">
            <h2 className="text-yellow-400 font-black text-sm uppercase italic tracking-widest mb-4">
              {activeImpairment === 'sunshine' ? 'Visual Accessibility Lab' : 'Cognitive Load Lab'}
            </h2>
            
            <p className="text-[11px] leading-relaxed opacity-80 mb-6">
              {activeImpairment === 'sunshine' 
                ? "Glare and low contrast (common in outdoor environments) wash out information. This simulation tests how CSS filter adjustments can restore legibility for users with visual impairments."
                : "Excessive saturation and UI distractions represent cognitive overload. Use the slider to filter out non-essential sensory noise and stabilize the terminal interface."}
            </p>

            <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-blue-400">system.repair_index</span>
                {/* Displaying the ACTUAL fixLevel state */}
                <span className="text-yellow-400 font-bold">{fixLevel}%</span>
              </div>

              <input 
                type="range" 
                min="0" 
                max="100" 
                value={fixLevel} // This binds the slider to the state
                onChange={(e) => setFixLevel(parseInt(e.target.value))} // This updates the state
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              
              <div className="pt-2">
                <span className={`text-[9px] uppercase tracking-tighter font-bold ${isFixed ? 'text-emerald-400' : 'text-white/20'}`}>
                  {isFixed ? "✓ Optimization Complete" : "Adjusting Accessibility Matrix..."}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/55 border border-white/15 text-white/85 text-[10px] font-semibold tracking-wide z-100 pointer-events-none backdrop-blur-sm">
          Click to start • Press Esc to exit
        </div>
      </div>
    </KeyboardControls>
  )
}