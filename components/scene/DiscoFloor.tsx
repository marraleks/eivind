"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  Color,
  NearestFilter,
  SRGBColorSpace,
  type Mesh,
} from "three";

const GRID = 12;
const TILE_PX = 48;
const GAP = 2;
const CANVAS_SIZE = GRID * TILE_PX;
const FLOOR_SIZE = 14;

const DISCO_PALETTE = [
  "#ff00ff",
  "#00ffff",
  "#ff4400",
  "#44ff00",
  "#ffff00",
  "#ff0066",
  "#6600ff",
  "#0088ff",
];

function makeDiscoTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  return { canvas, texture };
}

function paintDiscoTiles(
  canvas: HTMLCanvasElement,
  texture: CanvasTexture,
  t: number,
  colorBuf: Color
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  for (let col = 0; col < GRID; col++) {
    for (let row = 0; row < GRID; row++) {
      const phase = col * 0.7 + row * 1.3 + t * 1.5;
      const idx =
        Math.abs(
          (col * 3 + row * 7 + Math.floor(t * 2 + Math.sin(phase)))
        ) % DISCO_PALETTE.length;
      const brightness =
        0.35 + 0.65 * Math.abs(Math.sin(t * 3.5 + col * 1.1 + row * 0.9));

      colorBuf.set(DISCO_PALETTE[idx]);
      colorBuf.multiplyScalar(brightness);

      ctx.fillStyle = `#${colorBuf.getHexString()}`;
      ctx.fillRect(
        col * TILE_PX + GAP,
        row * TILE_PX + GAP,
        TILE_PX - GAP * 2,
        TILE_PX - GAP * 2
      );
    }
  }

  texture.needsUpdate = true;
}

export function DiscoFloor({ y = -2.2 }: { y?: number }) {
  const meshRef = useRef<Mesh>(null);
  const [disco] = useState(makeDiscoTexture);
  const [colorBuf] = useState(() => new Color());

  useFrame(({ clock }) => {
    paintDiscoTiles(disco.canvas, disco.texture, clock.getElapsedTime(), colorBuf);
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, y, 0]}
      receiveShadow
    >
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshStandardMaterial
        map={disco.texture}
        emissiveMap={disco.texture}
        emissive="#ffffff"
        emissiveIntensity={1.2}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  );
}
