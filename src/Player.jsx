import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

// 1. Add the onZoneEnter prop here
export function Player({ onZoneEnter }) {
  const meshRef = useRef()
  const [, getKeys] = useKeyboardControls()

useFrame((state, delta) => {
  const { forward, backward, left, right } = getKeys()
  const speed = 5
  const movement = new THREE.Vector3(0, 0, 0)

  // 1. Keyboard Logic (Desktop)
  if (forward) movement.z -= speed * delta
  if (backward) movement.z += speed * delta
  if (left) movement.x -= speed * delta
  if (right) movement.x += speed * delta

  // 2. Simple Touch/Click Logic (Mobile/Responsive)
  // If user is holding mouse/finger down, move toward that direction
  if (state.pointer.pressed) {
    movement.x += state.pointer.x * speed * delta
    movement.z -= state.pointer.y * speed * delta
  }

  if (meshRef.current) {
    meshRef.current.position.add(movement)
    
    // Collision Logic stays the same
    const pos = meshRef.current.position
    const inSunshine = pos.x > 3 && pos.x < 7 && pos.z > 3 && pos.z < 7
    const inTunnel = pos.x > -7 && pos.x < -3 && pos.z > -7 && pos.z < -3

    if (inSunshine) onZoneEnter('sunshine')
    else if (inTunnel) onZoneEnter('tunnel')
    else onZoneEnter(null)
    
    // Smooth camera follow
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