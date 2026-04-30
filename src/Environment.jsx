import * as THREE from 'three'

function Beacon({ color, intensity = 2 }) {
  return (
    <group>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, 1, 0]} distance={5} intensity={intensity} color={color} />
    </group>
  )
}

export function Environment() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      
      {/* 1. ATM Station (Motor) */}
      <group position={[12, 0, -12]}>
        <Beacon color="#22c55e" />
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1, 2.4, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 1.6, 0.31]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* 2. Park Bench (Sunshine) */}
      <group position={[-12, 0, 12]} rotation={[0, Math.PI / 4, 0]}>
        <Beacon color="#eab308" />
        <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[2.5, 0.1, 0.8]} /><meshStandardMaterial color="#451a03" /></mesh>
        <mesh position={[0, 0.7, -0.4]} castShadow><boxGeometry args={[2.5, 0.8, 0.1]} /><meshStandardMaterial color="#451a03" /></mesh>
      </group>

      {/* 3. Bus Stop (Tunnel) */}
      <group position={[0, 0, -18]}>
        <Beacon color="#3b82f6" />
        <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[4, 3, 0.1]} /><meshStandardMaterial color="#334155" transparent opacity={0.6} /></mesh>
      </group>

      {/* 4. Medical Sign (Blur) */}
      <group position={[-12, 0, -12]}>
        <Beacon color="#a855f7" />
        <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[0.2, 3, 1]} /><meshStandardMaterial color="#f8fafc" /></mesh>
        <mesh position={[0.11, 2, 0]}><planeGeometry args={[0.7, 0.7]} /><meshStandardMaterial color="#ef4444" /></mesh>
      </group>

      {/* 5. Subway Map (Colorblind) */}
      <group position={[12, 0, 12]} rotation={[0, -Math.PI / 4, 0]}>
        <Beacon color="#808080" />
        <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[1.5, 2, 0.1]} /><meshStandardMaterial color="#334155" /></mesh>
        {[0.4, 0.1, -0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.06]}><planeGeometry args={[1, 0.1]} /><meshStandardMaterial color={i===0?"red":i===1?"green":"blue"} /></mesh>
        ))}
      </group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <gridHelper args={[100, 50, 0x444444, 0x222222]} />
    </>
  )
}