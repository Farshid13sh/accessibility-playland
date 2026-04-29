import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls, Stats } from '@react-three/drei'
import { Player } from './Player'
import './index.css'

const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

// Helper Component for the Lab Floor
function Zone({ position, color, label }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} />
      </mesh>
      {/* Visual border for the zone */}
      <gridHelper args={[6, 1, color, color]} rotation={[0, 0, 0]} position={[0, 0.03, 0]} />
    </group>
  )
}

function App() {
  const [activeImpairment, setActiveImpairment] = useState(null)

  return (
    <KeyboardControls map={map}>
      {/* Wrapper with Dynamic Filters based on your previous site modes */}
      <div className={`relative w-full h-screen transition-all duration-700 overflow-hidden 
        ${activeImpairment === 'sunshine' ? 'filter-sunshine' : ''}
        ${activeImpairment === 'colorblind' ? 'filter-grayscale' : ''}
        ${activeImpairment === 'blur' ? 'filter-blur' : ''}
        ${activeImpairment === 'motor' ? 'animate-shake' : 'bg-slate-900'}
      `}>
        
        {/* TUNNEL VISION OVERLAY */}
        {activeImpairment === 'tunnel' && (
          <div className="absolute inset-0 z-20 pointer-events-none"
               style={{ background: 'radial-gradient(circle at center, transparent 15%, black 60%)' }} />
        )}

        {/* SIDEBAR - Styled like your original project */}
        <div className="absolute top-0 left-0 h-full w-64 bg-blue-700/90 z-40 p-6 text-white hidden md:flex flex-col border-r border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2 tracking-tighter">Accessibility Modes</h2>
          <div className="w-12 h-1 bg-yellow-400 mb-8"></div>
          
          <div className="space-y-6 flex-grow">
            {[
              { id: 'colorblind', label: 'Color Blindness' },
              { id: 'tunnel', label: 'Tunnel Vision' },
              { id: 'blur', label: 'Far-Sightedness' },
              { id: 'sunshine', label: 'Sunshine' },
              { id: 'motor', label: 'Concentration' }
            ].map((mode) => (
              <div key={mode.id} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${activeImpairment === mode.id ? 'bg-yellow-400 animate-ping' : 'bg-white/20'}`} />
                <p className={`text-sm tracking-wide ${activeImpairment === mode.id ? 'text-yellow-400 font-bold' : 'opacity-70'}`}>
                  {mode.label}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-red-600 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
          >
            Reset Lab
          </button>
          
          <div className="mt-6 text-[10px] opacity-40 uppercase tracking-widest font-mono">
            BCIT Project • Farshid Shakeri
          </div>
        </div>

        {/* 3D CANVAS */}
        <Canvas camera={{ position: [15, 15, 15], fov: 40 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          <Player onZoneEnter={setActiveImpairment} activeImpairment={activeImpairment} />

          {/* THE LAB FLOOR PLAN */}
          <Zone position={[10, 0, 10]} color="#808080" label="Color Blind" />
          <Zone position={[10, 0, -10]} color="#3b82f6" label="Tunnel Vision" />
          <Zone position={[-10, 0, -10]} color="#a855f7" label="Blurry Vision" />
          <Zone position={[-10, 0, 10]} color="#eab308" label="Sunshine" />
          <Zone position={[0, 0, 0]} color="#22c55e" label="Motor/Shake" />

          <gridHelper args={[40, 40, 0xffffff, 0x333333]} />
          <OrbitControls makeDefault />
          <Stats />
        </Canvas>
      </div>
    </KeyboardControls>
  )
}

export default App