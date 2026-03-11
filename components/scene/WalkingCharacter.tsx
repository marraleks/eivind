"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { AdventurerModel } from "@/components/scene/AdventurerModel";
import {
  getCharacterAnimationState,
  type CharacterAnimationState,
  type CharacterInputState,
} from "@/components/scene/characterState";

const Z_LEFT = -5;
const Z_RIGHT = 5;
const WALK_SPEED = 2.5;

export function WalkingCharacter({ floorY = -2.2 }: { floorY?: number }) {
  const groupRef = useRef<Group>(null);
  const zRef = useRef(0);
  const keysRef = useRef<CharacterInputState>({
    a: false,
    d: false,
    space: false,
    c: false,
  });
  const [animation, setAnimation] = useState<CharacterAnimationState>("idle");
  const prevAnimationRef = useRef<CharacterAnimationState>("idle");

  useEffect(() => {
    const syncAnimation = () =>
      setAnimation(getCharacterAnimationState(keysRef.current));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyA") keysRef.current.a = true;
      if (e.code === "KeyD") keysRef.current.d = true;
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.space = true;
      }
      if (e.code === "KeyC") keysRef.current.c = true;
      syncAnimation();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyA") keysRef.current.a = false;
      if (e.code === "KeyD") keysRef.current.d = false;
      if (e.code === "Space") keysRef.current.space = false;
      if (e.code === "KeyC") keysRef.current.c = false;
      syncAnimation();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const { a, d } = keysRef.current;

    // Keep animation state in sync with keys every frame (keyup can be missed)
    const nextAnimation = getCharacterAnimationState(keysRef.current);
    if (nextAnimation !== prevAnimationRef.current) {
      prevAnimationRef.current = nextAnimation;
      setAnimation(nextAnimation);
    }

    if (a) zRef.current += delta * WALK_SPEED;
    if (d) zRef.current -= delta * WALK_SPEED;
    if (zRef.current > Z_RIGHT) zRef.current = Z_LEFT;
    if (zRef.current < Z_LEFT) zRef.current = Z_RIGHT;

    if (groupRef.current) {
      groupRef.current.position.z = zRef.current;
      if (a && !d) groupRef.current.rotation.y = 0; // face +Z
      if (d && !a) groupRef.current.rotation.y = Math.PI; // face -Z
    }
  });

  const BOY_Y = floorY;

  return (
    <group ref={groupRef} position={[0, BOY_Y, 0]}>
      <AdventurerModel
        key={animation}
        scale={1}
        position={[0, 0, 0]}
        animation={animation}
      />
    </group>
  );
}
