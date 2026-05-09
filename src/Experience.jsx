import { useState, Suspense, useEffect } from 'react'
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
  const [fixLevel, setFixLevel] = useState(0)
  const isFixed = fixLevel > 90

  const handleZoneChange = (zone) => {
    if (zone !== activeImpairment) {
      setActiveImpairment(zone)
      setFixLevel(0) 
    }
  }

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        
        {/* 3D Scene with Dynamic Filters */}
        <div className={`absolute inset-0 transition-all duration-1000
            ${activeImpairment === 'sunshine' && !isFixed ? 'filter brightness-[1.8] contrast-[0.4] saturate-[0.5]' : ''}
            ${activeImpairment === 'concentration' && !isFixed ? 'filter saturate-[1.6]' : ''}
          `}>
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

        {/* Unified Fix UI Slider */}
        {activeImpairment && (
          <div className="absolute top-10 right-10 w-80 bg-slate-900/90 p-6 rounded-2xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-50">
            <h2 className="text-yellow-400 font-bold text-lg uppercase italic mb-2">
              {activeImpairment === 'sunshine' ? 'Outdoor Glare' : 'Cognitive Overload'}
            </h2>
            <p className="text-[11px] opacity-70 mb-4 leading-relaxed">
              {activeImpairment === 'sunshine' 
                ? "Low contrast and high brightness make this sign unreadable. Adjust the CSS filter to restore legibility."
                : "Distracting UI and motion blur hinder concentration. Use the slider to filter out sensory noise."}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-blue-400">filter: opacity({fixLevel}%)</span>
                <span className={isFixed ? "text-emerald-400" : "text-white/40"}>
                  {isFixed ? "✓ STABLE" : "REPAIRING..."}
                </span>
              </div>
              <input 
                type="range" min="0" max="100" value={fixLevel}
                onChange={(e) => setFixLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>
          </div>
        )}

        <Link to="/" className="absolute top-6 left-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg z-40">
          ← Back to Home
        </Link>
      </div>
    </KeyboardControls>
  )
}