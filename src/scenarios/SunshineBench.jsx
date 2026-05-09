import { Text, Html } from "@react-three/drei";

export default function SunshineBench({ isFixed, fixLevel }) {
  const opacity = fixLevel / 100;
  
  return (
    <group position={[0, 0, -5]}>
      {/* The Physical Bench */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2, 0.5, 0.8]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* The Information Sign */}
      <group position={[1.5, 0, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        
        <mesh position={[0, 1.8, 0.1]} receiveShadow>
          <planeGeometry args={[1.2, 0.8]} />
          <meshStandardMaterial 
            color={isFixed ? "white" : `rgb(${Math.round(204 + opacity * 51)}, ${Math.round(204 + opacity * 51)}, ${Math.round(204 + opacity * 51)})`}
            roughness={0.1}
          />
          
          <Html
            transform
            distanceFactor={0.8}
            position={[0, 0, 0.01]}
          >
            <div style={{
              padding: '10px',
              textAlign: 'center',
              backgroundColor: isFixed ? 'white' : `rgba(255,255,255,${0.3 + opacity * 0.7})`,
              color: isFixed ? '#1e293b' : `rgb(${Math.round(148 + opacity * 108)}, ${Math.round(163 + opacity * 92)}, ${Math.round(180 + opacity * 75)})`,
              width: '200px',
              fontFamily: 'sans-serif',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900 }}>STANLEY PARK</h3>
              <p style={{ fontSize: '10px', marginTop: '5px' }}>
                {fixLevel > 50 
                  ? "Welcome! Enjoy the scenic seawall." 
                  : `W_lc_${fixLevel > 25 ? 'o' : '_'}me! Enj_y th_ sc_n_${fixLevel > 25 ? 'i' : '_'}c s__w_ll.`
                }
              </p>
            </div>
          </Html>
        </mesh>
      </group>

      <Text
        position={[0, 2.5, 0]}
        fontSize={0.2}
        color="white"
      >
        PARK ZONE
      </Text>
    </group>
  );
}
