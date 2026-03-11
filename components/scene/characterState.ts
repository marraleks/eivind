export type CharacterAnimationState = "idle" | "walk" | "jump" | "dance";

export type CharacterInputState = {
  a: boolean;
  d: boolean;
  space: boolean;
  c: boolean;
};

type CharacterModelConfig = {
  url: "/idle.glb" | "/walk.glb" | "/jump.glb" | "/dance.glb";
  rotation: [number, number, number];
};

const SIDE_ROTATION: [number, number, number] = [Math.PI / 2, 0, Math.PI / 2];
const WALK_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0];

const MODEL_CONFIG: Record<CharacterAnimationState, CharacterModelConfig> = {
  idle: {
    url: "/idle.glb",
    rotation: SIDE_ROTATION,
  },
  walk: {
    url: "/walk.glb",
    rotation: WALK_ROTATION,
  },
  jump: {
    url: "/jump.glb",
    rotation: SIDE_ROTATION,
  },
  dance: {
    url: "/dance.glb",
    rotation: SIDE_ROTATION,
  },
};

export function getCharacterAnimationState(
  input: CharacterInputState
): CharacterAnimationState {
  if (input.c) return "dance";
  if (input.space) return "jump";
  if (input.a || input.d) return "walk";
  return "idle";
}

export function getCharacterModelConfig(
  state: CharacterAnimationState
): CharacterModelConfig {
  return MODEL_CONFIG[state];
}
