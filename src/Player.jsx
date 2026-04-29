import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

export function Player({ onZoneEnter, activeImpairment }) {
  const meshRef = useRef()
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys()
    
    // 1. Set Speed (Motor impairment makes you move slower)
    let speed = activeImpairment === 'motor' ? 2 : 7
    const movement = new THREE.Vector3(0, 0, 0)

    // Standard Movement Logic
    if (forward) movement.z -= speed * delta
    if (backward) movement.z += speed * delta
    if (left) movement.x -= speed * delta
    if (right) movement.x += speed * delta

    // 2. The Motor Jitter (Tremor Simulation)
    if (activeImpairment === 'motor') {
      movement.x += (Math.random() - 0.5) * 0.2
      movement.z += (Math.random() - 0.5) * 0.2
    }

    if (meshRef.current) {
      meshRef.current.position.add(movement)
      
      const pos = meshRef.current.position
      
      // 3. CLEAN ZONE DETECTION
      // This helper checks if the box is within a certain distance of a point
      const checkZone = (targetX, targetZ, radius = 3) => {
        return pos.x > targetX - radius && pos.x < targetX + radius && 
               pos.z > targetZ - radius && pos.z < targetZ + radius
      }

      // Matching the positions we set in App.jsx
      if (checkZone(10, 10)) {
        onZoneEnter('colorblind')
      } else if (checkZone(10, -10)) {
        onZoneEnter('tunnel')
      } else if (checkZone(-10, -10)) {
        onZoneEnter('blur')
      } else if (checkZone(-10, 10)) {
        onZoneEnter('sunshine')
      } else if (checkZone(0, 0)) {
        onZoneEnter('motor')
      } else {
        onZoneEnter(null)
      }
      
      // Keep the camera focused on the player
      state.camera.lookAt(pos)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#10b981" />
    </mesh>
  )
}