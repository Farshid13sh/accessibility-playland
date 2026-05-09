import { useGLTF, Text } from '@react-three/drei'
import ATMConcentration from './scenarios/ATMConcentration'
import * as THREE from 'three'

export function Environment() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      
      {/* Sunshine Bench Zone */}
      <group position={[0, 0, -8]}>
        <RealisticBench />
        <InfoSign />
        <Beacon color="#eab308" isFlashing={true} />
      </group>

      {/* ATM Concentration Zone */}
      <Beacon color="#3b82f6" position={[15, 0, -8]} isFlashing={false} />
      <ATMConcentration isFixed={false} fixLevel={0} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <gridHelper args={[100, 50, 0x333333, 0x222222]} />
    </>
  )
}

function RealisticBench() {
  const { scene } = useGLTF('/assets/Bench.glb')
  return <primitive object={scene} position={[.5, 0, 1.1]} scale={0.01} rotation={[0, Math.PI / 2, 0]} castShadow />
}

function InfoSign() {
  const textProps = {
    color: "black",
    anchorX: "center",
    anchorY: "middle",
    textAlign: "center",
    frustumCulled: false,
  }

  return (
    <group position={[.5, 0, -1]} rotation={[0, Math.PI / 2.2, 0]}>
      
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[1.6, 2.7, 0.05]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0, 1.25, 0.03]}>
        <planeGeometry args={[1.5, 2.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Text
        {...textProps}
        position={[0, 2.2, 0.04]}
        fontSize={0.11}
        fontWeight="bold"
        maxWidth={1.4}
      >
        STANLEY PARK VANCOUVER
      </Text>

      <group position={[0, 1.1, 0.04]}>
        <mesh>
          <planeGeometry args={[1.3, 1.0]} />
          <meshStandardMaterial color="#93c5fd" />
        </mesh>

        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[1.1, 0.8]} />
          <meshStandardMaterial color="#166534" />
        </mesh>

        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[0.35, 0.4, 32, 1, 0, Math.PI * 1.5]} />
          <meshBasicMaterial color="#e5e7eb" />
        </mesh>

        <mesh position={[-0.1, 0, 0.002]} rotation={[0, 0, 0.2]}>
          <planeGeometry args={[0.03, 0.7]} />
          <meshBasicMaterial color="#9ca3af" />
        </mesh>

        <mesh position={[0.2, -0.2, 0.003]}>
          <circleGeometry args={[0.12, 32]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>

        <mesh position={[0.1, -0.1, 0.005]}>
          <circleGeometry args={[0.03, 32]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      <Text
        {...textProps}
        position={[0, 0.35, 0.04]}
        fontSize={0.06}
        maxWidth={1.2}
      >
        FACILITIES:{"\n"}
        • Totem Poles: 400m East{"\n"}
        • Vancouver Aquarium: 1km North{"\n"}
        • Emergency: Use Gate Phone
      </Text>

      <Text
        {...textProps}
        position={[0, -0.6, 0.04]}
        fontSize={0.035}
        color="#4b5563"
      >
        CITY OF VANCOUVER PARKS & RECREATION
      </Text>
    </group>
  )
}

function Beacon({ color, position = [0, 0.01, 0], isFlashing = false }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
        <ringGeometry args={[2.5, 2.8, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isFlashing ? 0.8 : 0.5}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <pointLight 
        position={[0, 1, 0]} 
        distance={5} 
        intensity={isFlashing ? 3 : 1.2} 
        color={color}
      />
    </group>
  )
}
