# State management for 3D apps

## Good defaults

- React state: UI selections, menu state, modal state, active scene mode
- Store: camera mode, selected mesh, scene context, active animation state
- Refs: mesh transforms, camera targets, animation track state, per-frame values

## Avoid

- Putting every mesh transform into React state
- Updating scene state from multiple animation systems without a clear owner
- Driving the same transform from both a physics engine and a scroll timeline

## Recommended library choices

- Zustand for shared scene state
- React state for component-local interactions
- Refs for frequently changing values
