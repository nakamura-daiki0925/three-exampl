'use client'

import { Canvas } from '@react-three/fiber';
import { useSceneStore } from '../store/useSceneStore';

type BoxProps = { id: string; position: [number, number, number] };

const SelectableBox = ({ id, position }: BoxProps) => {
  const selectedId = useSceneStore((s) => s.selectedId);
  const setSelectedId = useSceneStore((s) => s.setSelectedId);
  const isSelected = selectedId === id;

  return (
    <mesh position={position} onClick={() => setSelectedId(id)}>
      <sphereGeometry/>
      <meshStandardMaterial color={isSelected ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

export const SceneCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <SelectableBox id="box1" position={[-1.5, 0, 0]} />
      <SelectableBox id="box2" position={[1.5, 0, 0]} />
    </Canvas>
  );
};
