import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'
import { Player } from './Player'
import { Environment } from './Environment'
import { Interface, impairmentData } from './Interface'

const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

export default function App() {
  const [activeImpairment, setActiveImpairment] = useState(null)
  const [isFixed, setIsFixed] = useState(false)

  const handleCheckCode = (val) => {
    if (val === impairmentData[activeImpairment]?.solution) setIsFixed(true)
  }

  const handleZoneChange = (zone) => {
    if (zone !== activeImpairment) {
      setActiveImpairment(zone);
      setIsFixed(false);
    }
  }

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        
        {/* VIEWPORT WITH FILTERS */}
        <div className={`absolute inset-0 transition-all duration-1000 
          ${activeImpairment === 'sunshine' && !isFixed ? 'filter-sunshine' : ''}
          ${activeImpairment === 'blur' && !isFixed ? 'filter-blur' : ''}
          ${activeImpairment === 'colorblind' && !isFixed ? 'filter-grayscale' : ''}
          ${activeImpairment === 'motor' && !isFixed ? 'animate-shake' : ''}
        `}>
          <Canvas shadows>
             <Player onZoneEnter={handleZoneChange} activeImpairment={activeImpairment} isFixed={isFixed} />
             <Environment />
             <PointerLockControls />
          </Canvas>

          {activeImpairment === 'tunnel' && !isFixed && (
            <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_100px_black]"
                 style={{ background: 'radial-gradient(circle at center, transparent 15%, black 85%)' }} />
          )}
        </div>

        {/* UI OVERLAY */}
        <Interface activeImpairment={activeImpairment} isFixed={isFixed} onCheckCode={handleCheckCode} />

        <div className="absolute bottom-6 left-6 text-white/20 text-[9px] tracking-[0.3em] uppercase pointer-events-none">
          WASD Walk • Click to Explore • ESC to Unlock
        </div>
      </div>
    </KeyboardControls>
  )
}