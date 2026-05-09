import { Text, Html } from "@react-three/drei";

export default function ATMConcentration({ isFixed, fixLevel = 0 }) {
  // Normalize fixLevel (0-100) to 0.0 - 1.0
  const currentFix = isFixed ? 1 : fixLevel / 100;

  return (
    <group position={[15, 0, -8]}>
      {/* ATM Main Body: Set transparent to false to ensure it is fully opaque */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.2, 2.4, 0.8]} />
        <meshStandardMaterial 
          color={currentFix > 0.5 ? "#1e40af" : "#111827"} 
          metalness={0.7}
          roughness={0.2}
          transparent={false} // Make body solid so the back isn't visible
          opacity={1}
        />
      </mesh>

      {/* RED SIGN: Disappears as currentFix increases */}
      {currentFix < 0.9 && (
        <group position={[0, 2.3, 0.45]}>
          <mesh>
            <planeGeometry args={[1.1, 0.4]} />
            <meshStandardMaterial 
              color="#ef4444" 
              transparent={true}
              opacity={1 - currentFix}
              emissive="#ef4444"
              emissiveIntensity={0.5 * (1 - currentFix)}
              depthWrite={false} // Prevents "box" artifacts around transparent edges
            />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.1} color="white" fontWeight="900">
            !!! WINNER !!!
          </Text>
        </group>
      )}

      {/* YELLOW SIDE AD */}
      <mesh position={[0.61, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 2.0]} />
        <meshStandardMaterial 
          color="#facc15" 
          transparent={true} 
          opacity={1 - currentFix}
          emissive="#facc15"
          emissiveIntensity={0.2 * (1 - currentFix)}
          depthWrite={false}
        />
      </mesh>

      {/* THE SCREEN: Optimized for total opacity */}
      <group position={[0, 1.5, 0.46]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.92, 0.72]} />
          {/* Ensure the black background of the screen is 100% solid */}
          <meshStandardMaterial color="#000" transparent={false} opacity={1} />
        </mesh>
        
        <Html 
          transform 
          distanceFactor={1.1}
          style={{
            pointerEvents: 'none',
            transition: 'all 0.3s ease-out',
            // Use 'isolation' to prevent background bleeding
            isolation: 'isolate' 
          }}
        >
          <div className={`w-64 h-48 flex flex-col items-center justify-center rounded-lg border-4
            ${currentFix > 0.5 ? 'bg-blue-900 border-blue-400' : 'bg-red-950 border-yellow-500 animate-pulse'}`}
            style={{ 
              filter: `blur(${(1 - currentFix) * 6}px)`,
              opacity: 1, // Keep HTML fully opaque
              backgroundColor: currentFix > 0.5 ? '#1e3a8a' : '#450a0a' // Hardcode colors to avoid transparency
            }}
          >
            <h3 className="text-white font-black text-[10px] mb-4 uppercase tracking-widest">
              {currentFix > 0.5 ? "✓ SECURE" : "⚠ SYSTEM BUSY"}
            </h3>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-10 border-2 border-white/30 rounded flex items-center justify-center text-white font-bold">
                  {currentFix > 0.8 ? "•" : "?"}
                </div>
              ))}
            </div>
            <button className={`px-8 py-2 font-black text-[8px] uppercase
              ${currentFix > 0.5 ? 'bg-emerald-500 text-white' : 'bg-white text-black'}`}>
              {currentFix > 0.5 ? "Enter" : "WAIT!"}
            </button>
          </div>
        </Html>
      </group>

      <Text position={[0, 2.8, 0]} fontSize={0.15} color="white" fontWeight="bold">BANKING TERMINAL</Text>
    </group>
  );
}