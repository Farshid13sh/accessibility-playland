import * as THREE from 'three';
import { Text, Html } from "@react-three/drei";

export default function ATMConcentration({ isFixed, fixLevel = 0 }) {
  const currentFix = isFixed ? 1 : fixLevel / 100;

  return (
    <group>
      {/* 1. ATM Main Body - FORCED OPAQUE */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.2, 2.4, 0.8]} />
        <meshStandardMaterial 
          color={currentFix > 0.5 ? "#1e40af" : "#111827"} 
          transparent={false} 
          opacity={1} 
          depthWrite={true}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 2. Screen Interface */}
      <group position={[0, 1.5, 0.401]}> 
        <mesh>
          <planeGeometry args={[0.95, 0.75]} />
          <meshBasicMaterial color="black" transparent={false} />
        </mesh>
        
        <Html transform distanceFactor={1.1} position={[0, 0, 0.01]}>
          <div className={`w-64 h-48 flex flex-col items-center justify-center rounded-lg border-4 transition-all duration-300
            ${currentFix > 0.5 ? 'bg-blue-900 border-blue-400' : 'bg-red-950 border-yellow-500'}`}
            style={{ 
              filter: `blur(${(1 - currentFix) * 6}px)`,
              backgroundColor: currentFix > 0.5 ? '#1e3a8a' : '#450a0a'
            }}
          >
            <h3 className="text-white font-black text-[10px] mb-4 uppercase">
              {currentFix > 0.5 ? "✓ SECURE" : "⚠ BUSY"}
            </h3>
            <div className="flex gap-2">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="w-8 h-10 border-2 border-white/30 text-white flex items-center justify-center font-bold">
                   {currentFix > 0.8 ? "•" : "?"}
                 </div>
               ))}
            </div>
          </div>
        </Html>
      </group>

      {/* 3. Floating Distraction Signs */}
      {currentFix < 0.9 && (
        <group position={[0, 2.3, 0.45]}>
          <mesh>
            <planeGeometry args={[1.1, 0.4]} />
            <meshStandardMaterial color="#ef4444" transparent opacity={1 - currentFix} depthWrite={true} />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.1} color="white" fontWeight="900">!!! WINNER !!!</Text>
        </group>
      )}

      <Text position={[0, 2.8, 0]} fontSize={0.15} color="white" fontWeight="bold">BANKING TERMINAL</Text>
    </group>
  );
}