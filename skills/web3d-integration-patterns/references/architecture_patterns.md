# Architecture patterns for Web 3D integration

## Layered composition

Split the app into three owners:

1. Three.js or R3F for scene composition
2. GSAP for scroll and timeline orchestration
3. React + Motion for UI and interaction state

Keep the boundaries explicit and avoid animating the same property through multiple libraries.

## When to choose each pattern

- Layered separation: best for marketing pages and cinematic product experiences
- Unified React component tree: best for React-native app logic and component reuse
- Hybrid GSAP timeline inside R3F: best for complex authored sequences
- Spring physics: best for gesture-driven feel and subtle microinteractions
