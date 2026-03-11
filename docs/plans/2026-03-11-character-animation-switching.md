# Character Animation Switching Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Switch the character model between `idle`, `walk`, `jump`, and `dance` assets based on keyboard input, with `C` overriding `Space`, `Space` overriding walking, and walking overriding idle.

**Architecture:** Keep keyboard handling in `WalkingCharacter`, derive a single animation state from the pressed keys, and pass that state into `AdventurerModel`. Centralize the state priority and model URL/rotation mapping in a small helper module so the behavior is easy to test without rendering the full Three scene.

**Tech Stack:** React, React Three Fiber, Drei, Vitest

---

### Task 1: Add test coverage for animation priority and asset mapping

**Files:**
- Create: `components/scene/characterState.test.ts`
- Create: `components/scene/characterState.ts`

**Step 1: Write the failing test**

Add tests that verify:
- `c` wins over all other inputs
- `space` wins over walking
- walking is selected for `a` or `d`
- idle is selected with no relevant keys
- idle/jump/dance map to Z rotation `Math.PI / 2`
- walk keeps the current rotation

**Step 2: Run test to verify it fails**

Run: `npm test -- components/scene/characterState.test.ts`

Expected: FAIL because `characterState.ts` does not exist yet.

**Step 3: Write minimal implementation**

Add a helper module that exports:
- the animation state type
- a `getCharacterAnimationState()` function
- a `getCharacterModelConfig()` function

**Step 4: Run test to verify it passes**

Run: `npm test -- components/scene/characterState.test.ts`

Expected: PASS

### Task 2: Wire the scene to use the derived animation state

**Files:**
- Modify: `components/scene/WalkingCharacter.tsx`
- Modify: `components/scene/AdventurerModel.tsx`

**Step 1: Update keyboard state**

Track `Space` and `C` in `WalkingCharacter`, then derive the active animation state using the helper.

**Step 2: Update model rendering**

Make `AdventurerModel` load the correct GLB for the active state and apply the matching rotation while preserving animation playback.

**Step 3: Run focused tests**

Run: `npm test -- components/scene/characterState.test.ts components/scene/AdventurerModel.test.tsx`

Expected: PASS

### Task 3: Verify the whole test suite and lints

**Files:**
- Modify if needed: `components/scene/AdventurerModel.test.tsx`

**Step 1: Run all tests**

Run: `npm test`

Expected: PASS

**Step 2: Check lints**

Run lints/diagnostics for the touched files and fix any issues that appear.
