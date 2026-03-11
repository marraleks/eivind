"use client";

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { LoopOnce, LoopRepeat } from "three";
import type { AnimationClip, Material, Object3D, SkinnedMesh } from "three";
import {
  getCharacterModelConfig,
  type CharacterAnimationState,
} from "@/components/scene/characterState";

type ModelGLTF = {
  nodes: {
    node_0: SkinnedMesh;
    mixamorigHips: Object3D;
  };
  materials: Record<string, Material>;
  animations: AnimationClip[];
};

type AdventurerModelProps = React.ComponentProps<"group"> & {
  animation?: CharacterAnimationState;
};

export function AdventurerModel({
  animation = "idle",
  ...props
}: AdventurerModelProps) {
  const group = useRef<React.ComponentRef<"group">>(null);
  const { url, rotation } = getCharacterModelConfig(animation);
  const { nodes, materials, animations } = useGLTF(url) as unknown as ModelGLTF;
  const { actions } = useAnimations(animations, group);
  const mesh = nodes.node_0 as SkinnedMesh;
  const material = Object.values(materials)[0];

  useEffect(() => {
    const allActions = Object.values(actions);
    allActions.forEach((a) => a?.stop());

    const action = allActions[0];
    if (action) {
      const loopOnce = animation === "jump" || animation === "dance";
      action.setLoop(loopOnce ? LoopOnce : LoopRepeat, loopOnce ? 1 : Infinity);
      action.reset().play();
    }

    return () => {
      allActions.forEach((a) => a?.stop());
    };
  }, [actions, animation]);

  if (!material) {
    return null;
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={rotation} scale={0.02}>
          <skinnedMesh
            name="node_0"
            geometry={mesh.geometry}
            material={material}
            skeleton={mesh.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/idle.glb");
useGLTF.preload("/walk.glb");
useGLTF.preload("/jump.glb");
useGLTF.preload("/dance.glb");
