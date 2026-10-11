---
name: web3d-integration-patterns
description: >
  Meta-skill for combining Three.js, GSAP ScrollTrigger, React Three Fiber, Motion, and React Spring in high-performance 3D web experiences.
  Trigger: When building scroll-driven 3D experiences, immersive landing pages, product viewers, or interactive scenes that combine multiple 3D and animation libraries.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Building complex 3D applications that combine multiple libraries
- Creating scroll-driven 3D experiences with animation orchestration
- Implementing physics-based interactions with 3D scenes
- Managing state across 3D rendering and UI animations
- Optimizing performance in multi-library architectures
- Designing reusable component architectures for 3D applications
- Migrating or mixing animation approaches across React, Three.js, and GSAP

## Critical Patterns

### 1. Separate responsibilities by layer

Use different libraries for different responsibilities instead of making all of them control the same object.

- Three.js: low-level scene, camera, renderer, meshes, lighting
- GSAP + ScrollTrigger: timeline control, scroll orchestration, cinematic sequencing
- React + Motion: HTML/UI overlays, interactive state, declarative UI animation
- React Spring: physics-like feel for gesture-driven transforms
- R3F: React-friendly scene components without giving up Three.js rendering

```jsx
import { useEffect, useRef } from 'react'
import { initThreeScene } from './three/scene'
import { initScrollAnimations } from './animations/scroll'
import { motion } from 'framer-motion'

export function App() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    sceneRef.current = initThreeScene(canvasRef.current)
    initScrollAnimations(sceneRef.current)

    return () => sceneRef.current?.dispose?.()
  }, [])

  return (
    <div className="app-shell">
      <canvas ref={canvasRef} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <section>3D Experience</section>
      </motion.div>
    </div>
  )
}
```

### 2. Choose one owner per property

Avoid conflicting animations on the same property.

```jsx
// ❌ Bad: GSAP and React Spring both animate position
gsap.to(meshRef.current.position, { x: 5 })
api.start({ position: [10, 0, 0] })

// ✅ Better: split ownership
gsap.to(meshRef.current.position, { x: 5 })
api.start({ scale: 1.5 })
```

### 3. Keep React and Three.js state aligned

When a 3D object changes, update both the actual mesh and the React state that expresses selection or mode.

```jsx
const updatePosition = (x) => {
  mesh.position.x = x
  setPosition(x)
}
```

### 4. Clean up every lifetime hook

GSAP timelines, ScrollTrigger listeners, and event subscriptions must be torn down on unmount.

```jsx
useEffect(() => {
  const tween = gsap.to(meshRef.current.rotation, {
    y: Math.PI * 2,
    repeat: -1,
  })

  return () => tween.kill()
}, [])
```

## Architecture Patterns

### Pattern: Layered separation

Use when you have a UI overlay, camera choreography, and a 3D scene together.

```text
3D Layer (Three.js)
├── scene and camera
├── rendering loop
└── meshes and lighting

Animation Layer (GSAP)
├── scroll-driven camera paths
├── timeline sequencing
└── motion refinement

UI Layer (React + Motion)
├── overlays and text
├── state-driven UI updates
└── user interactions
```

### Pattern: Unified React component architecture

Use R3F + Motion when the app is already React-first and you want declarative component composition.

```jsx
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Scene } from './components/Scene'

export function App() {
  return (
    <div className="app-shell">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }} dpr={[1, 2]} shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>React-first 3D Experience</h1>
      </motion.div>
    </div>
  )
}
```

### Pattern: Hybrid GSAP timeline inside R3F

Use this when you need narrative timing, complex sequencing, or scroll choreography while staying in a React scene graph.

```jsx
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'

export function AnimatedScene() {
  const groupRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true })

    tl.to(groupRef.current.position, { y: 2, duration: 1, ease: 'power2.inOut' })
      .to(groupRef.current.rotation, { y: Math.PI * 2, duration: 2, ease: 'none' }, 0)

    return () => tl.kill()
  }, [])

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </group>
  )
}
```

### Pattern: Physics-based interaction

Use R3F + React Spring when the motion should feel elastic, reactive, and natural.

```jsx
import { animated, useSpring, config } from '@react-spring/three'

const AnimatedMesh = animated('mesh')

export function PhysicsCube() {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    position: [0, 0, 0],
    config: config.wobbly,
  }))

  const handleClick = () => {
    api.start({ scale: 1.5, position: [0, 2, 0] })
    setTimeout(() => api.start({ scale: 1, position: [0, 0, 0] }), 900)
  }

  return (
    <AnimatedMesh scale={spring.scale} position={spring.position} onClick={handleClick}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </AnimatedMesh>
  )
}
```

## State Management Strategies

### Zustand for shared 3D state

Use when multiple parts of the app need to know the active object, camera mode, or scene state.

```js
import { create } from 'zustand'

export const useSceneStore = create((set) => ({
  selectedObject: null,
  cameraMode: 'orbit',
  setSelectedObject: (id) => set({ selectedObject: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
}))
```

### Rule of thumb

- Use local React state for component-local animation
- Use a small shared store for cross-scene state
- Use refs for high-frequency transforms and render-driven values
- Avoid serializing per-frame Three.js data into global UI state

## Performance Optimization

### Render loop coordination

- Prefer one authoritative render loop for scene updates
- Reduce unnecessary re-renders with refs and memoization
- Use `frameloop="demand"` in R3F for interaction-heavy workloads
- Keep `dpr` bounded: `[1, 2]` is a good default
- Use instancing for large particle or repeated mesh systems

```jsx
<Canvas frameloop="demand" dpr={[1, 2]}>
  <Scene />
</Canvas>
```

### Scroll-trigger rules

- Keep high-cost transforms in Three.js or R3F, not in React DOM trees
- Use `ScrollTrigger` to drive camera or object transforms instead of a large React animation tree
- Pin expensive sections only when necessary
- Remove GSAP listeners on cleanup

## Common Pitfalls

### 1. Animation conflicts

Multiple libraries animating the same property results in jitter and fighting updates.

### 2. State synchronization gaps

Three.js updates happen outside React, so the UI can drift from the scene state.

### 3. Unbounded render churn

Keeping object position in React state every frame causes expensive reconciliation.

### 4. Leaked listeners and timelines

Not cleaning up GSAP and ScrollTrigger causes stale motion after component unmount.

## Decision Matrix

| Use Case | Recommended Stack | Why |
| --- | --- | --- |
| Scroll-driven landing page | Three.js + GSAP + React UI | GSAP is best at timeline and scroll choreography |
| Product viewer or interactive 3D scene | R3F + Motion | Declarative, state-driven, reusable components |
| Complex 3D sequences | R3F + GSAP | Timeline control with React scene structure |
| Physics-like gestures | R3F + React Spring | Spring motion feels natural for drag and momentum |
| High-performance particle systems | Three.js + GSAP | Imperative control and low overhead |
| Fast prototyping | R3F + Drei + Motion | Higher abstraction and quick iteration |

## Code Examples

### Scroll-driven camera

```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#experience',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    pin: true,
  },
})

tl.to(camera.position, { x: 5, y: 3, z: 8, duration: 1 })
```

### Gesture-driven object

```jsx
import { motion } from 'framer-motion-3d'

function DraggableObject() {
  return (
    <motion.mesh drag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="hotpink" />
    </motion.mesh>
  )
}
```

## Commands

```bash
npm install three gsap @react-three/fiber @react-three/drei framer-motion @react-spring/three zustand
```

## Resources

- **Templates**: See [assets/](assets/) for starter layout and integration examples
- **Documentation**: See [references/](references/) for architecture and performance notes
