"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";

import { FadedBackgroundText } from "@/components/scene/FadedBackgroundText";
import { DiscoFloor } from "@/components/scene/DiscoFloor";
import { StrobeLights } from "@/components/scene/StrobeLights";
import { WalkingCharacter } from "@/components/scene/WalkingCharacter";

const FLOOR_Y = -2.2;

export default function HomeScene() {
  return (
    <div className="fixed inset-0 bg-[url('/byen.png')] bg-cover bg-center h-full w-full opacity-50">
      <FadedBackgroundText />
      <div className="relative z-1 h-full w-full">
        <Canvas
          shadows
          camera={{
            position: [7, 1.1, 0],
            fov: 50,
            up: [0, 1, 0],
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ camera, scene, gl }) => {
            camera.lookAt(0, 0.5, 0);
            scene.background = null;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="city" background={false} />
            <ambientLight intensity={0.15} />
            <StrobeLights />
            <DiscoFloor y={FLOOR_Y} />
            <WalkingCharacter floorY={FLOOR_Y} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
