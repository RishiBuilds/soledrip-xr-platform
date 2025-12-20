import { useRef, Suspense } from "react";
import { useGLTF, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShoeModelProps {
  url?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

// Stylized 3D shoe fallback using primitives
function FallbackShoe({ autoRotate = true, rotationSpeed = 0.005 }: { autoRotate?: boolean; rotationSpeed?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.2}>
      {/* Sole */}
      <RoundedBox args={[2, 0.15, 0.9]} radius={0.06} position={[0, -0.35, 0]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </RoundedBox>
      {/* Midsole */}
      <RoundedBox args={[1.9, 0.12, 0.85]} radius={0.05} position={[0, -0.22, 0]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
      </RoundedBox>
      {/* Upper base */}
      <RoundedBox args={[1.7, 0.4, 0.75]} radius={0.12} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      {/* Toe box */}
      <RoundedBox args={[0.6, 0.3, 0.7]} radius={0.15} position={[0.6, -0.02, 0]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
      </RoundedBox>
      {/* Heel counter */}
      <RoundedBox args={[0.5, 0.55, 0.7]} radius={0.1} position={[-0.65, 0.12, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      {/* Swoosh / accent stripe */}
      <RoundedBox args={[1.1, 0.06, 0.78]} radius={0.02} position={[0.05, 0.08, 0]}>
        <meshStandardMaterial color="#e94560" roughness={0.2} metalness={0.6} />
      </RoundedBox>
      {/* Tongue */}
      <RoundedBox args={[0.35, 0.45, 0.5]} radius={0.08} position={[0.15, 0.35, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.4} />
      </RoundedBox>
      {/* Collar */}
      <RoundedBox args={[0.7, 0.2, 0.65]} radius={0.08} position={[-0.35, 0.35, 0]}>
        <meshStandardMaterial color="#2d4a6f" roughness={0.5} />
      </RoundedBox>
      {/* Lace area */}
      <RoundedBox args={[0.6, 0.08, 0.3]} radius={0.02} position={[0.15, 0.28, 0]}>
        <meshStandardMaterial color="#333" roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

// GLTF Model loader component
function GLTFModel({ url, autoRotate = true, rotationSpeed = 0.005 }: { url: string; autoRotate?: boolean; rotationSpeed?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  // Center and scale the model
  const clonedScene = scene.clone();
  const box = new THREE.Box3().setFromObject(clonedScene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;
  
  clonedScene.scale.setScalar(scale);
  clonedScene.position.sub(center.multiplyScalar(scale));
  
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Error boundary wrapper for GLTF loading
function ModelWithFallback({ url, autoRotate, rotationSpeed }: ShoeModelProps) {
  if (!url) {
    return <FallbackShoe autoRotate={autoRotate} rotationSpeed={rotationSpeed} />;
  }

  return (
    <Suspense fallback={<FallbackShoe autoRotate={autoRotate} rotationSpeed={rotationSpeed} />}>
      <GLTFModel url={url} autoRotate={autoRotate} rotationSpeed={rotationSpeed} />
    </Suspense>
  );
}

export function ShoeModel({ url, autoRotate = true, rotationSpeed = 0.005 }: ShoeModelProps) {
  // Only try to load GLTF if URL is from our Supabase storage
  const isValidUrl = url && url.includes("supabase");
  
  return (
    <ModelWithFallback 
      url={isValidUrl ? url : undefined} 
      autoRotate={autoRotate} 
      rotationSpeed={rotationSpeed} 
    />
  );
}
