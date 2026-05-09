import { useState, Suspense, useRef, useEffect } from 'react'
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
  const [isFixed, setIsFixed] = useState(false)
  const canvasRef = useRef(null)

  const handleCheckCode = (val) => {
    if (val === "1") setIsFixed(true)
  }

  const handleZoneChange = (zone) => {
    if (zone !== activeImpairment) {
      setActiveImpairment(zone)
      setIsFixed(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove any leftover popups
      document.querySelectorAll('[style*="z-index: 99999"]').forEach(el => el.remove())
      // Remove tunnel vision overlay
      document.querySelectorAll('[style*="mask-image"]').forEach(el => el.remove())
    }
  }, [])

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen bg-black overflow-hidden">

        {/* 3D Canvas */}
        <div 
          ref={canvasRef}
          className={`absolute inset-0 transition-all duration-1000
            ${activeImpairment === 'sunshine' && !isFixed ? 'filter brightness-[1.8] contrast-[0.4] saturate-[0.5]' : ''}
          `}
        >
          <Canvas shadows>
            <Suspense fallback={null}>
              <Player onZoneEnter={handleZoneChange} />
              <Environment />
            </Suspense>
            <PointerLockControls />
          </Canvas>
        </div>

        {/* Park Scenario Overlay (only when active) */}
        {activeImpairment && (
          <div className="absolute top-10 right-10 w-80 bg-slate-900/90 p-8 rounded-2xl border border-white/10 text-white shadow-2xl backdrop-blur-xl z-50">
            <h2 className="text-yellow-400 font-bold text-xl uppercase italic mb-4">Park Scenario</h2>
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
                  onChange={(e) => handleCheckCode(e.target.value)}
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

        {/* Controls Guide */}
        <div className="absolute bottom-6 left-6 text-white/20 text-[9px] tracking-widest uppercase pointer-events-none">
          WASD Walk • Click to Look • ESC to Unlock Mouse
        </div>

        {/* Back to Home Link - Simple, Clean */}
        <Link
          to="/"
          aria-label="Back to home page"
          className="absolute top-6 left-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors focus:outline-4 focus:outline-blue-400 focus:outline-offset-2 z-40"
        >
          ← Back to Home
        </Link>
      </div>
    </KeyboardControls>
  )
}
