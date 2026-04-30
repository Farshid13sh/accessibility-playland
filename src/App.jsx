import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'
import { Player } from './Player'
import { Environment } from './Environment'
import { Interface } from './Interface'

// Input mapping for the Player controller
const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

export default function App() {
  const [activeImpairment, setActiveImpairment] = useState(null)
  const [isFixed, setIsFixed] = useState(false)

  // Logic to handle "fixing" the vision impairment via the Interface
  const handleCheckCode = (val) => {
    if (val === "1") setIsFixed(true)
  }

  // Triggered when the player enters a specific physics trigger zone
  const handleZoneChange = (zone) => {
    if (zone !== activeImpairment) {
      setActiveImpairment(zone)
      setIsFixed(false)
    }
  }

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        
        {/* VIEWPORT LAYER: Handles the 3D Canvas and CSS post-processing filters */}
        <div className={`absolute inset-0 transition-all duration-1000 
          ${activeImpairment === 'sunshine' && !isFixed ? 'filter brightness-[1.8] contrast-[0.4] saturate-[0.5]' : ''}
        `}>
          <Canvas shadows>
             {/* 
                CRITICAL: Suspense prevents the "KI" text glitch seen in 
                Screenshot 2026-04-29 at 18.38.11.png by waiting for 
                assets to fully load before rendering.
             */}
             <Suspense fallback={null}>
                <Player onZoneEnter={handleZoneChange} />
                <Environment />
             </Suspense>
             
             <PointerLockControls />
          </Canvas>
        </div>

        {/* UI LAYER: Overlays the interactive menus and HUD */}
        <Interface 
          activeImpairment={activeImpairment} 
          isFixed={isFixed} 
          onCheckCode={handleCheckCode} 
        />

        {/* CONTROLS GUIDE */}
        <div className="absolute bottom-6 left-6 text-white/20 text-[9px] tracking-widest uppercase pointer-events-none">
          WASD Walk • Click to Look • ESC to Unlock Mouse
        </div>
      </div>
    </KeyboardControls>
  )
}