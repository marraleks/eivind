"use client";

const PATH_LENGTH = 14;
const PATH_WIDTH = 2.2;

// Match WalkingCharacter vertical placement (1/4 from bottom)
const VIEW_BOTTOM_Y = -2.75;
const VIEW_HEIGHT = 6.5;
const ROAD_Y = VIEW_BOTTOM_Y + 0.25 * VIEW_HEIGHT;

export function RoadOfLife() {
  return (
    <group position={[0, ROAD_Y, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[PATH_WIDTH, PATH_LENGTH]} />
        <meshStandardMaterial
          color="#2d2a26"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PATH_WIDTH + 0.4, PATH_LENGTH + 0.4]} />
        <meshStandardMaterial color="#1a1814" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}
