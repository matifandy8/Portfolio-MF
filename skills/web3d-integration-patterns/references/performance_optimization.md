# Performance guidance

## Keep animation ownership clear

The scene should not be mutated at both the React and DOM layer. Use refs for meshes, cameras, or transforms that change every frame.

## Optimize render loops

- Use bounded DPR values
- Use `frameloop="demand"` when the scene is interaction-driven
- Avoid positioning large numbers of objects in React state
- Use instancing for hundreds of repeated meshes
- Keep ScrollTrigger scopes narrow and clean up listeners

## Keep the app responsive

Heavy animation should not block layout or DOM update work. Separate 3D render work from UI state work and use the smallest possible state surface.
