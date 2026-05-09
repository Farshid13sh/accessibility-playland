import { useGLTF, Text } from '@react-three/drei'
import * as THREE from 'three'
import ATMConcentration from './scenarios/ATMConcentration'

export function Environment({ activeImpairment, isFixed, fixLevel }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      
      {/* --- SUNSHINE ZONE --- */}
      <group position={[0, 0, -8]}>
         <Beacon color="#eab308" isFlashing={activeImpairment === 'sunshine'} />
         <RealisticBench />
         <InfoSign />
      </group>

      {/* --- ATM ZONE --- */}
      <group position={[15, 0, -8]}>
        <Beacon color="#3b82f6" isFlashing={activeImpairment === 'concentration'} />
        <ATMConcentration 
            isFixed={activeImpairment === 'concentration' ? isFixed : true} 
            fixLevel={activeImpairment === 'concentration' ? fixLevel : 100} 
        />
      </group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <gridHelper args={[100, 50, 0x333333, 0x222222]} />
    </>
  )
}

function Beacon({ color, isFlashing }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <ringGeometry args={[2.5, 2.8, 32]} />
      <meshBasicMaterial color={color} transparent opacity={isFlashing ? 0.8 : 0.2} />
    </mesh>
  )
}

function RealisticBench() {
  const { scene } = useGLTF('/assets/Bench.glb')
  return <primitive object={scene} position={[0.5, 0, 1.1]} scale={0.01} rotation={[0, Math.PI / 2, 0]} castShadow />
}

function InfoSign() {
  // ... (Your existing InfoSign code remains here)
  return (
    <group position={[0.5, 0, -1]} rotation={[0, Math.PI / 2.2, 0]}>
       <mesh position={[0, 1.25, 0]}><boxGeometry args={[1.6, 2.7, 0.05]} /><meshStandardMaterial color="#111827" /></mesh>
       <mesh position={[0, 1.25, 0.03]}><planeGeometry args={[1.5, 2.6]} /><meshStandardMaterial color="#ffffff" /></mesh>
       <Text position={[0, 2.2, 0.04]} fontSize={0.11} color="black" fontWeight="bold">STANLEY PARK</Text>
    </group>
  )
}