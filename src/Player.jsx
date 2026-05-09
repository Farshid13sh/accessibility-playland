import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

export function Player({ onZoneEnter }) {
  const meshRef = useRef()
  const lastZoneRef = useRef(null)
  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys()
    const speed = 5
    
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward))
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0)

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta).applyQuaternion(camera.quaternion)
    direction.y = 0 

    if (meshRef.current) {
      meshRef.current.position.add(direction)
      camera.position.copy(meshRef.current.position).add(new THREE.Vector3(0, 1.7, 0))

      const benchDist = meshRef.current.position.distanceTo(new THREE.Vector3(0, 0, -8))
      const atmDist = meshRef.current.position.distanceTo(new THREE.Vector3(15, 0, -8))

      let nextZone = null
      if (benchDist < 3.5) nextZone = 'sunshine'
      else if (atmDist < 3.5) nextZone = 'concentration'

      // Only notify when zone changes to avoid resetting slider state every frame.
      if (nextZone !== lastZoneRef.current) {
        lastZoneRef.current = nextZone
        onZoneEnter(nextZone)
      }
    }
  })

  return <mesh ref={meshRef}><capsuleGeometry args={[0.3, 1]} /><meshStandardMaterial transparent opacity={0}/></mesh>
}
