import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

export function Player({ onZoneEnter, activeImpairment, isFixed }) {
  const meshRef = useRef()
  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys()
    const speed = (activeImpairment === 'motor' && !isFixed) ? 1.5 : 5
    
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward))
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0)

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta).applyQuaternion(camera.quaternion)
    direction.y = 0 

    if (meshRef.current) {
      meshRef.current.position.add(direction)
      camera.position.copy(meshRef.current.position).add(new THREE.Vector3(0, 1.7, 0))

      const pos = meshRef.current.position
      const dists = {
        motor: pos.distanceTo(new THREE.Vector3(12, 0, -12)),
        sunshine: pos.distanceTo(new THREE.Vector3(-12, 0, 12)),
        tunnel: pos.distanceTo(new THREE.Vector3(0, 0, -18)),
        blur: pos.distanceTo(new THREE.Vector3(-12, 0, -12)),
        colorblind: pos.distanceTo(new THREE.Vector3(12, 0, 12))
      }

      if (dists.motor < 3) onZoneEnter('motor')
      else if (dists.sunshine < 3) onZoneEnter('sunshine')
      else if (dists.tunnel < 4) onZoneEnter('tunnel')
      else if (dists.blur < 3) onZoneEnter('blur')
      else if (dists.colorblind < 3) onZoneEnter('colorblind')
      else onZoneEnter(null)
      
      if (activeImpairment === 'motor' && !isFixed) {
        camera.position.x += (Math.random() - 0.5) * 0.1
        camera.position.y += (Math.random() - 0.5) * 0.1
      }
    }
  })

  return <mesh ref={meshRef}><capsuleGeometry args={[0.3, 1, 4]} /><meshStandardMaterial transparent opacity={0}/></mesh>
}