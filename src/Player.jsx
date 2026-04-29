import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

export function Player({ onZoneEnter, activeImpairment, isFixed }) {
  const meshRef = useRef()
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys()
    
    // Normal speed is 7, Motor speed is 2
    let speed = (activeImpairment === 'motor' && !isFixed) ? 2 : 7
    const movement = new THREE.Vector3(0, 0, 0)

    if (forward) movement.z -= speed * delta
    if (backward) movement.z += speed * delta
    if (left) movement.x -= speed * delta
    if (right) movement.x += speed * delta

    // Jitter logic
    if (activeImpairment === 'motor' && !isFixed) {
      movement.x += (Math.random() - 0.5) * 0.25
      movement.z += (Math.random() - 0.5) * 0.25
    }

    if (meshRef.current) {
      meshRef.current.position.add(movement)
      const pos = meshRef.current.position
      
      const checkZone = (tx, tz, r = 3) => {
        return pos.x > tx - r && pos.x < tx + r && pos.z > tz - r && pos.z < tz + r
      }

      // Check all 5 zones defined in App.jsx
      if (checkZone(10, 10)) onZoneEnter('colorblind')
      else if (checkZone(10, -10)) onZoneEnter('tunnel')
      else if (checkZone(-10, -10)) onZoneEnter('blur')
      else if (checkZone(-10, 10)) onZoneEnter('sunshine')
      else if (checkZone(0, 0)) onZoneEnter('motor')
      else onZoneEnter(null)
      
      state.camera.lookAt(pos)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#10b981" />
    </mesh>
  )
}