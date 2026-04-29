import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls, Stats } from '@react-three/drei'
import { Player } from './Player.jsx'
import './index.css'
import { useState } from 'react'

// This defines which keys do what
const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

function App() {
  const [activeImpairment, setActiveImpairment] = useState(null)

  return (
    <KeyboardControls map={map}>
      <div className={`relative w-full h-screen transition-all duration-500 overflow-hidden ${
        activeImpairment === 'sunshine' ? 'brightness-150 saturate-50' : 'bg-slate-900'
      }`}>
        
        {/* TUNNEL VISION - Responsive Gradient */}
        {activeImpairment === 'tunnel' && (
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 15%, black 60%)'
            }}
          />
        )}

        {/* HUD - Responsive Text & Padding */}
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
          <div className="p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/20">
            <h1 className="text-sm md:text-xl font-bold uppercase tracking-tighter">Accessibility Lab</h1>
            <p className="text-[10px] md:text-xs text-emerald-400 font-mono">
               {activeImpairment ? `MODE: ${activeImpairment}` : 'MODE: NORMAL'}
            </p>
          </div>
          
          {/* Mobile Instruction Hint */}
          <div className="md:hidden p-2 bg-black/40 rounded text-[10px] text-white">
            Tap screen to move
          </div>
        </div>

        {/* The Canvas automatically handles window resize */}
        <Canvas 
          shadows 
          camera={{ position: [10, 10, 10], fov: 35 }}
          dpr={[1, 2]} // Optimizes resolution for high-DPI (Retina) screens
        >
          <ambientLight intensity={1.5} />
          <Player onZoneEnter={setActiveImpairment} />
          
          {/* We use smaller grid for mobile feel */}
          <gridHelper args={[20, 20, 0x444444, 0x222222]} />
          
          {/* Red Zone */}
          <mesh position={[5, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial color="red" transparent opacity={0.3} />
          </mesh>

          {/* Blue Zone */}
          <mesh position={[-5, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial color="blue" transparent opacity={0.3} />
          </mesh>

          <OrbitControls makeDefault enableDamping />
        </Canvas>
      </div>
    </KeyboardControls>
  )
}

export default App