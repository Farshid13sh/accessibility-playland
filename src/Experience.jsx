import { useState, Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { Player } from './Player'
import { Environment } from './Environment'
import SunshineBench from './scenarios/SunshineBench'
import ATMConcentration from './scenarios/ATMConcentration'

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

  useEffect(() => {
    return () => {
      document.querySelectorAll('[style*="z-index: 99999"]').forEach(el => el.remove())
      document.querySelectorAll('[style*="mask-image"]').forEach(el => el.remove())
    }
  }, [])

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        <div 
          className={`absolute inset-0 transition-all duration-1000
            ${activeImpairment === 'sunshine' && !isFixed ? 'filter brightness-[1.8] contrast-[0.6]' : ''}
            ${activeImpairment === 'concentration' && !isFixed ? 'filter saturate-[1.6]' : ''}
          `}
        >
          <Canvas shadows camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <Player onZoneEnter={handleZoneChange} />
              <Environment />
              
              {activeImpairment === 'sunshine' && (
                <SunshineBench isFixed={isFixed} fixLevel={fixLevel} />
              )}

              {activeImpairment === 'concentration' && (
                <ATMConcentration isFixed={isFixed} fixLevel={fixLevel} />
              )}
            </Suspense>
            <PointerLockControls />
          </Canvas>
        </div>

        {activeImpairment && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 bg-slate-900/95 p-6 rounded-3xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-yellow-400 font-black text-sm uppercase italic tracking-widest">
                {activeImpairment === 'sunshine' ? 'Glare Reduction' : 'Cognitive Filter'}
              </h2>
              <span className="font-mono text-[10px] text-white/40">{fixLevel}%</span>
            </div>

            <input 
              type="range" 
              min="0" max="100" 
              value={fixLevel}
              onChange={(e) => setFixLevel(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
            
            <div className="mt-4 text-center">
              {isFixed ? (
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">✓ Simulation Optimized</span>
              ) : (
                <span className="text-[10px] font-medium text-white/30 uppercase tracking-tighter">Slide right to fix accessibility barriers</span>
              )}
            </div>
          </div>
        )}

        <Link to="/" className="absolute top-6 left-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all z-40">
          ← Exit Lab
        </Link>
      </div>
    </KeyboardControls>
  )
}
