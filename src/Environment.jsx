import { useGLTF, Text } from '@react-three/drei'
import ATMConcentration from './scenarios/ATMConcentration'

export function Environment({ activeImpairment, isFixed, fixLevel }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      
      {/* SUNSHINE ZONE */}
      <group position={[0, 0, -8]}>
         <Beacon color="#eab308" isFlashing={activeImpairment === 'sunshine'} />
         <RealisticBench />
         <InfoSign fixLevel={activeImpairment === 'sunshine' ? fixLevel : 100} />
      </group>

      {/* ATM ZONE */}
      <group position={[15, 0, -8]}>
        <Beacon color="#3b82f6" isFlashing={activeImpairment === 'concentration'} />
        <ATMConcentration 
            isFixed={isFixed && activeImpairment === 'concentration'} 
            fixLevel={activeImpairment === 'concentration' ? fixLevel : 100} 
        />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  )
}

function InfoSign({ fixLevel }) {
  const opacity = 0.2 + (0.8 * (fixLevel / 100))
  
  return (
    <group position={[0.5, 0, -1]} rotation={[0, Math.PI / 2.2, 0]}>
      <mesh position={[0, 1.25, 0]}><boxGeometry args={[1.6, 2.7, 0.05]} /><meshStandardMaterial color="#111827" /></mesh>
      <mesh position={[0, 1.25, 0.03]}><planeGeometry args={[1.5, 2.6]} /><meshStandardMaterial color="white" /></mesh>

      <Text position={[0, 2.2, 0.04]} fontSize={0.11} color="black" fontWeight="900" fillOpacity={opacity}>
        STANLEY PARK VANCOUVER
      </Text>

      <group position={[0, 1.1, 0.04]} scale={opacity}>
        <mesh><planeGeometry args={[1.3, 1.0]} /><meshStandardMaterial color="#93c5fd" /></mesh>
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[1.1, 0.8]} /><meshStandardMaterial color="#166534" /></mesh>
      </group>

      <Text position={[0, 0.35, 0.04]} fontSize={0.06} color="black" maxWidth={1.2} fillOpacity={opacity} lineHeight={1.6}>
        FACILITIES:{'\n'}
        • Totem Poles: 400m East{'\n'}
        • Vancouver Aquarium: 1km North{'\n'}
        • Emergency: Use Gate Phone
      </Text>

      <Text position={[0, -0.6, 0.04]} fontSize={0.035} color="#4b5563" fillOpacity={opacity}>
        CITY OF VANCOUVER PARKS & RECREATION
      </Text>
    </group>
  )
}

function Beacon({ color, isFlashing }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <ringGeometry args={[2.5, 2.8, 32]} />
      <meshBasicMaterial color={color} transparent opacity={isFlashing ? 0.8 : 0.15} />
    </mesh>
  )
}

function RealisticBench() {
  const { scene } = useGLTF('/assets/Bench.glb')
  return <primitive object={scene} position={[0.5, 0, 1.1]} scale={0.01} rotation={[0, Math.PI / 2, 0]} castShadow />
}