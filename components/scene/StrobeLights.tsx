"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import { Vector3 } from "three";
import type { SpotLight as SpotLightImpl } from "three";

const WANDER_RADIUS = 3;
const WANDER_SPEED = 2;

function MovingSpot({
  vec = new Vector3(),
  seed = 0,
  ...props
}: { vec?: Vector3; seed?: number } & React.ComponentProps<typeof SpotLight>) {
  const light = useRef<SpotLightImpl>(null);

  useFrame((state) => {
    if (!light.current) return;
    const t = state.clock.elapsedTime * WANDER_SPEED + seed * 100;
    vec.set(
      Math.sin(t) * WANDER_RADIUS + Math.cos(t * 0.7) * (WANDER_RADIUS * 0.5),
      Math.cos(t * 0.8) * WANDER_RADIUS +
        Math.sin(t * 0.6) * (WANDER_RADIUS * 0.5),
      0,
    );
    light.current.target.position.lerp(vec, 0.05);
    light.current.target.updateMatrixWorld();
  });

  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={1}
      distance={10}
      angle={0.35}
      attenuation={5}
      anglePower={4}
      intensity={2}
      {...props}
    />
  );
}

export function StrobeLights() {
  return (
    <>
      <MovingSpot color="#ff00ff" position={[3, 5, 2]} seed={0} />
      <MovingSpot color="#00ffff" position={[1, 5, -2]} seed={1} />
      <MovingSpot color="#ffff00" position={[-1, 5, 1]} seed={2} />
      <MovingSpot color="#ff4400" position={[-3, 5, -1]} seed={3} />
    </>
  );
}
